// src/extension.ts
import * as vscode from 'vscode';
import * as https from 'node:https';
import type { IncomingMessage } from 'node:http';

// 获取配置的 API Key
function getApiKey(): string | undefined {
    const config = vscode.workspace.getConfiguration('deepseekBalance');
    return config.get<string>('apiKey');
}

// HTTP GET 请求封装（使用 Node.js 原生 https）
function httpsGet(url: string, headers: Record<string, string>): Promise<string> {
    return new Promise((resolve, reject) => {
        https.get(url, { headers }, (res: IncomingMessage) => {
            let body = '';
            res.on('data', (chunk: string) => body += chunk);
            res.on('end', () => {
                if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(body);
                } else {
                    reject(new Error(`API 请求失败 (${res.statusCode}): ${body}`));
                }
            });
        }).on('error', reject);
    });
}

// 查询余额的核心函数
async function fetchBalance(apiKey: string): Promise<string> {
    const url = 'https://api.deepseek.com/user/balance';
    const body = await httpsGet(url, { 'Authorization': `Bearer ${apiKey}` });
    const data = JSON.parse(body);
    // 提取总余额，保留两位小数
    const balance = data.balance_infos?.[0]?.total_balance;
    if (balance === undefined) {
        throw new Error('无法解析余额数据');
    }
    return parseFloat(balance).toFixed(2);
}

// 更新状态栏
async function updateStatusBar(statusBarItem: vscode.StatusBarItem) {
    const apiKey = getApiKey();
    if (!apiKey) {
        statusBarItem.text = "$DeepSeek: 未配置 API Key";
        statusBarItem.tooltip = "请打开设置 (Cmd+,) 配置 deepseekBalance.apiKey";
        return;
    }

    statusBarItem.text = "$(sync~spin) 查询余额...";
    try {
        const balance = await fetchBalance(apiKey);
        statusBarItem.text = `$DeepSeek: ¥${balance}`;
        statusBarItem.tooltip = `当前余额: ¥${balance}`;
    } catch (error: any) {
        statusBarItem.text = "$DeepSeek: (error)余额查询失败";
        statusBarItem.tooltip = error.message;
    }
}

// 插件激活函数
export function activate(context: vscode.ExtensionContext) {
    console.log('DeepSeek 余额插件已激活');
    // 1. 创建状态栏项，放在右侧，优先级较高
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
    statusBarItem.command = 'deepseek-balance.refresh'; // 点击时刷新
    context.subscriptions.push(statusBarItem);

    // 2. 注册刷新命令
    const refreshCommand = vscode.commands.registerCommand('deepseek-balance.refresh', () => {
        updateStatusBar(statusBarItem);
    });
    context.subscriptions.push(refreshCommand);

    // 3. 监听配置变化，当用户更新 API Key 时自动刷新
    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration((event) => {
            if (event.affectsConfiguration('deepseekBalance.apiKey')) {
                updateStatusBar(statusBarItem);
            }
        })
    );

    // 4. 定时器：每 5 分钟自动刷新余额
    const intervalId = setInterval(() => {
        updateStatusBar(statusBarItem);
    }, 5 * 60 * 1000);
    context.subscriptions.push({ dispose: () => clearInterval(intervalId) });

    // 5. 首次显示
    updateStatusBar(statusBarItem);
    statusBarItem.show();
}

// 插件停用函数（空实现即可）
export function deactivate() {}