# DeepSeek Balance

在 VS Code 状态栏实时显示你的 DeepSeek API 余额。

## 功能

- 📊 **状态栏显示余额** — 在 VS Code 底部状态栏右侧显示 DeepSeek 余额
- 🔄 **自动刷新** — 每 5 分钟自动查询一次余额
- 🖱️ **手动刷新** — 点击状态栏或执行命令即可手动刷新
- ⚙️ **配置监听** — 修改 API Key 后自动刷新

## 使用

1. 在 [DeepSeek 平台](https://platform.deepseek.com) 获取你的 API Key
2. 打开 VS Code 设置 (`Cmd+,`)，搜索 `deepseekBalance.apiKey`，填入你的 API Key
3. 状态栏右侧将自动显示余额

| 状态栏显示 | 含义 |
|-----------|------|
| ⚠️ DeepSeek: 未配置 API Key | 尚未配置 API Key |
| 🔄 查询余额... | 正在查询中 |
| 🗄️ DeepSeek: ¥12.34 | 当前余额 |
| ❌ 余额查询失败 | 查询出错 |

也可通过命令面板 (`Cmd+Shift+P`) 执行 **DeepSeek: 刷新余额** 手动刷新。

## 扩展设置

| 设置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `deepseekBalance.apiKey` | `string` | `""` | DeepSeek API Key |

## 要求

- VS Code 1.125.0 及以上版本
- 有效的 DeepSeek API Key

## 版本记录

### 0.0.1

- 初始版本
- 状态栏显示余额
- 每 5 分钟自动刷新
- 点击/命令手动刷新
