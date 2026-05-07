@echo off
chcp 65001 > nul
echo ========================================
echo Storyverse 项目启动
echo ========================================
echo.

echo [1/2] 检查依赖...
if not exist "node_modules" (
    echo 未检测到 node_modules，正在安装依赖...
    call npm install
    if errorlevel 1 (
        echo 依赖安装失败！
        pause
        exit /b 1
    )
    echo 依赖安装完成！
    echo.
)

echo [2/2] 启动服务器...
echo.
echo 服务器将在 http://localhost:3000 启动
echo 按 Ctrl+C 可以停止服务器
echo ========================================
echo.

npm start