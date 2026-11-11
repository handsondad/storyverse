# 第三方素材

## 站酷快乐体（ZCOOL KuaiLe）

- 来源：https://github.com/google/fonts/tree/main/ofl/zcoolkuaile
- 许可：SIL Open Font License 1.1（`public/fonts/OFL.txt`，和字体一起发布）
- 使用：子集化后放在 `public/fonts/story.woff`，用 `npm run font` 生成

## 配音（Microsoft Edge 在线语音）

`public/voice/` 里的配音由 [edge-tts](https://github.com/rany2/edge-tts)（GPL-3.0，只在生成时使用，不随网站发布）调用微软 Edge「大声朗读」的在线神经语音生成：小念 `zh-CN-YunxiaNeural`，爸爸 `zh-CN-YunxiNeural`，妈妈和旁白 `zh-CN-XiaoxiaoNeural`，姥爷 `zh-CN-YunjianNeural`，阿姨 `zh-CN-XiaoyiNeural`，叔叔 `zh-CN-YunyangNeural`。这项服务没有为批量生成音频单独给出授权条款，所以这些音频只按家庭和非商业用途考虑；商用前应改用有明确商用授权的语音服务（如 Azure AI Speech）重新生成。

## 旧版存档

分支 `archive/ai-image` 里曾使用过外部图像生成接口和飞书存储；当前 `main` 不再包含那些依赖。
