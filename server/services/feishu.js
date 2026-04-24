const axios = require('axios');
const fs = require('fs');
const path = require('path');

class FeishuService {
  constructor() {
    this.appId = process.env.FEISHU_APP_ID || '';
    this.appSecret = process.env.FEISHU_APP_SECRET || '';
    this.tenantAccessToken = null;
    this.tokenExpiry = null;
    this.baseUrl = 'https://open.feishu.cn/open-apis';
    this.bitableToken = process.env.FEISHU_BITABLE_TOKEN || '';
    this.booksTableId = null;
    this.pagesTableId = null;
  }

  isConfigured() {
    return !!(this.appId && this.appSecret && this.bitableToken);
  }

  async getTenantAccessToken() {
    if (this.tenantAccessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.tenantAccessToken;
    }

    try {
      const response = await axios.post(`${this.baseUrl}/auth/v3/tenant_access_token/internal`, {
        app_id: this.appId,
        app_secret: this.appSecret
      });

      if (response.data.code === 0) {
        this.tenantAccessToken = response.data.tenant_access_token;
        this.tokenExpiry = Date.now() + (response.data.expire * 1000) - 60000;
        return this.tenantAccessToken;
      } else {
        throw new Error(`获取飞书访问令牌失败: ${response.data.msg}`);
      }
    } catch (error) {
      console.error('获取飞书 tenant_access_token 失败:', error.message);
      throw error;
    }
  }

  async request(method, url, data = null, params = null) {
    const token = await this.getTenantAccessToken();
    const config = {
      method,
      url: url.startsWith('http') ? url : `${this.baseUrl}${url}`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    if (data) {
      config.data = data;
    }
    if (params) {
      config.params = params;
    }

    const response = await axios(config);
    return response.data;
  }

  async getAppInfo() {
    return this.request('GET', '/application/v6/applications/me');
  }

  async createBitable(name) {
    try {
      const response = await this.request('POST', '/bitable/v1/apps', {
        name
      });
      return response.data;
    } catch (error) {
      console.error('创建多维表格失败:', error.message);
      throw error;
    }
  }

  async getBitableInfo() {
    if (!this.bitablToken) {
      throw new Error('未配置多维表格 Token');
    }
    return this.request('GET', `/bitable/v1/apps/${this.bitableToken}`);
  }

  async createTable(tableName, fields = []) {
    try {
      const response = await this.request('POST', `/bitable/v1/apps/${this.bitableToken}/tables`, {
        table: {
          name: tableName,
          default_view_name: 'Default View',
          fields: fields.map(name => ({ field_name: name }))
        }
      });
      return response.data;
    } catch (error) {
      console.error('创建数据表失败:', error.message);
      throw error;
    }
  }

  async getTables() {
    try {
      const response = await this.request('GET', `/bitable/v1/apps/${this.bitableToken}/tables`);
      return response.data?.items || [];
    } catch (error) {
      console.error('获取数据表列表失败:', error.message);
      return [];
    }
  }

  async getTableInfo(tableId) {
    return this.request('GET', `/bitable/v1/apps/${this.bitableToken}/tables/${tableId}`);
  }

  async createField(tableId, fieldName, fieldType = 1) {
    try {
      const response = await this.request('POST', `/bitable/v1/apps/${this.bitableToken}/tables/${tableId}/fields`, {
        field_name: fieldName,
        type: fieldType
      });
      return response.data;
    } catch (error) {
      if (error.response?.data?.code === 230002) {
        return null;
      }
      throw error;
    }
  }

  async listFields(tableId) {
    try {
      const response = await this.request('GET', `/bitable/v1/apps/${this.bitableToken}/tables/${tableId}/fields`);
      return response.data?.items || [];
    } catch (error) {
      console.error('获取字段列表失败:', error.message);
      return [];
    }
  }

  async batchCreateRecords(tableId, records) {
    try {
      const response = await this.request('POST', `/bitable/v1/apps/${this.bitableToken}/tables/${tableId}/records/batch_create`, {
        records: records.map(record => ({ fields: record }))
      });
      return response.data;
    } catch (error) {
      console.error('批量创建记录失败:', error.message);
      throw error;
    }
  }

  async createRecord(tableId, fields) {
    try {
      const response = await this.request('POST', `/bitable/v1/apps/${this.bitableToken}/tables/${tableId}/records`, {
        fields
      });
      return response.data;
    } catch (error) {
      console.error('创建记录失败:', error.message);
      throw error;
    }
  }

  async getRecord(tableId, recordId) {
    try {
      const response = await this.request('GET', `/bitable/v1/apps/${this.bitableToken}/tables/${tableId}/records/${recordId}`);
      return response.data;
    } catch (error) {
      if (error.response?.data?.code === 230006) {
        return null;
      }
      throw error;
    }
  }

  async updateRecord(tableId, recordId, fields) {
    try {
      const response = await this.request('PUT', `/bitable/v1/apps/${this.bitableToken}/tables/${tableId}/records/${recordId}`, {
        fields
      });
      return response.data;
    } catch (error) {
      console.error('更新记录失败:', error.message);
      throw error;
    }
  }

  async deleteRecord(tableId, recordId) {
    try {
      await this.request('DELETE', `/bitable/v1/apps/${this.bitableToken}/tables/${tableId}/records/${recordId}`);
      return true;
    } catch (error) {
      console.error('删除记录失败:', error.message);
      return false;
    }
  }

  async listRecords(tableId, params = {}) {
    try {
      const response = await this.request('GET', `/bitable/v1/apps/${this.bitableToken}/tables/${tableId}/records`, params);
      return {
        items: response.data?.items || [],
        hasMore: response.data?.has_more || false,
        total: response.data?.total || 0
      };
    } catch (error) {
      console.error('获取记录列表失败:', error.message);
      return { items: [], hasMore: false, total: 0 };
    }
  }

  async getAllRecords(tableId) {
    let allRecords = [];
    let pageToken = null;

    do {
      const params = pageToken ? { page_token: pageToken, page_size: 500 } : { page_size: 500 };
      const result = await this.listRecords(tableId, params);
      allRecords = allRecords.concat(result.items);
      pageToken = result.hasMore ? (result.items[result.items.length - 1]?.record_id || null) : null;
    } while (pageToken);

    return allRecords;
  }

  async ensureBooksTable() {
    const tables = await this.getTables();
    let booksTable = tables.find(t => t.name === 'Books');

    if (!booksTable) {
      const result = await this.createTable('Books', ['id', 'title', 'coverUrl', 'pageCount', 'isPublished', 'published_at', 'created_by', 'created_at', 'updated_at']);
      booksTable = result.table;
    }

    this.booksTableId = booksTable.table_id;
    return this.booksTableId;
  }

  async ensurePagesTable() {
    const tables = await this.getTables();
    let pagesTable = tables.find(t => t.name === 'BookPages');

    if (!pagesTable) {
      const result = await this.createTable('BookPages', ['bookId', 'index', 'content', 'imageUrl']);
      pagesTable = result.table;
    }

    this.pagesTableId = pagesTable.table_id;
    return this.pagesTableId;
  }

  async initializeBitable() {
    if (!this.isConfigured()) {
      throw new Error('飞书 API 未配置，请设置 FEISHU_APP_ID、FEISHU_APP_SECRET 和 FEISHU_BITABLE_TOKEN 环境变量');
    }

    await this.ensureBooksTable();
    await this.ensurePagesTable();

    console.log(`飞书多维表格初始化完成`);
    console.log(`Books 表 ID: ${this.booksTableId}`);
    console.log(`Pages 表 ID: ${this.pagesTableId}`);
  }
}

const feishuService = new FeishuService();

module.exports = feishuService;