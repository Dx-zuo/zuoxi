"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../TUIComponents/container/TUIChat/utils/utils");
const chat_1 = require("@tencentcloud/chat");
class TUINotification {
    constructor(params) {
        this.allowNotifications = true;
        this.showPreviews = true;
        this.notificationTitle = '腾讯云 IM ';
        this.notificationIcon = 'https://web.sdk.qcloud.com/im/demo/latest/faviconnew.png';
        if (!params)
            return;
        (params?.allowNotifications !== undefined) && (this.allowNotifications = params.allowNotifications);
        (params?.showPreviews !== undefined) && (this.showPreviews = params.showPreviews);
        (params?.notificationTitle !== undefined) && (this.notificationTitle = params.notificationTitle);
        (params?.notificationIcon !== undefined) && (this.notificationIcon = params.notificationIcon);
    }
    /**
   * 获取 TUINotification 实例
   *
   * @returns {TUINotification}
   */
    static getInstance(options) {
        if (!TUINotification.instance) {
            TUINotification.instance = new TUINotification(options);
        }
        return TUINotification.instance;
    }
    /**
   * 挂载到 TUICore
   *
   * @param {TUICore} TUICore TUICore实例
   */
    static plugin(TUICore, options) {
        TUICore.config.notification = this.getInstance(options);
        this.TUICore = TUICore;
    }
    /**
   * 挂载到 vue 实例的上
   *
   * @param {app} app vue的实例
   */
    static install(app) {
        app.use(this.getInstance());
    }
    setNotificationConfiguration(params) {
        if (!params)
            return;
        (params?.allowNotifications !== undefined) && (this.allowNotifications = params.allowNotifications);
        (params?.showPreviews !== undefined) && (this.showPreviews = params.showPreviews);
        (params?.notificationTitle !== undefined) && (this.notificationTitle = params.notificationTitle);
        (params?.notificationIcon !== undefined) && (this.notificationIcon = params.notificationIcon);
    }
    async notify(message) {
        if (!this.allowNotifications) {
            return;
        }
        if (!this.checkNotificationAbility()) {
            return;
        }
        if (!await this.requestNotificationPermission()) {
            return;
        }
        await this.handleNotification(message);
    }
    checkNotificationAbility() {
        if (!('Notification' in window) || window.Notification.permission === 'denied') {
            return false;
        }
        return true;
    }
    requestNotificationPermission() {
        return new Promise((resolve, reject) => {
            if (!window?.Notification)
                reject(false);
            if (window.Notification.permission === 'granted') {
                resolve(true);
            }
            window.Notification.requestPermission().then(permission => {
                // 如果用户同意，就可以向他们发送通知
                if (permission === 'granted') {
                    resolve(true);
                }
            }).catch(() => {
                reject(false);
            });
        });
    }
    async handleNotification(message) {
        if (!this._isMessageNeedNotification(message))
            return;
        const notificationType = this._handleNotificationType(message);
        let content;
        let options = {
            badge: this.notificationIcon,
            icon: this.notificationIcon,
            body: '',
            requireInteraction: false,
        };
        switch (notificationType) {
            case 'call':
                content = this._handleCallNotificationContent(message);
                if (!content?.content) {
                    return;
                }
                options.body = content.content;
                options.requireInteraction = !content.callEnd;
                break;
            case 'chat':
                options.body = await this._handleChatNotificationContent(message);
                options.requireInteraction = false;
                break;
        }
        const notification = new Notification(this.notificationTitle, options);
        notification.onclick = () => {
            window.focus();
            if (!message || !message?.conversationID) {
                return;
            }
            const TUIConversationServer = TUINotification?.TUICore?.TUIServer?.TUIConversation;
            if (message?.conversationType === chat_1.default.TYPES.CONV_C2C || message?.conversationType === chat_1.default.TYPES.CONV_GROUP) {
                TUIConversationServer?.getConversationProfile(message?.conversationID).then((imResponse) => {
                    imResponse?.data?.conversation && TUIConversationServer.handleCurrentConversation(imResponse?.data?.conversation);
                });
            }
            notification.close();
        };
    }
    _isMessageNeedNotification(message) {
        if (!message || !message?.ID || !message?.type ||
            message?.isRevoked || message?.isDeleted ||
            (utils_1.isTypingMessage && (0, utils_1.isTypingMessage)(message))) {
            return false;
        }
        if (message?.type === chat_1.default.TYPES.MSG_GRP_TIP || message?.type === chat_1.default.TYPES.MSG_GRP_SYS_NOTICE) {
            return false;
        }
        const currentConversationID = TUINotification?.TUICore?.TUIServer?.TUIConversation?.currentStore?.currentConversationID;
        if (this.checkPageFocus() && message?.conversationID === currentConversationID) {
            return false;
        }
        return true;
    }
    _handleNotificationType(message) {
        if (message.type === chat_1.default.TYPES.MSG_CUSTOM) {
            const payloadData = (0, utils_1.JSONToObject)(message?.payload?.data);
            if (payloadData?.businessID === 1 || payloadData?.businessID === 'av_call') {
                return 'call';
            }
        }
        return 'chat';
    }
    async _handleChatNotificationContent(message) {
        let content = '';
        if (!message || !message?.ID || !message?.type) {
            return content;
        }
        switch (this.showPreviews) {
            case true:
                content = await this._handleChatNotificationContentTitle(message);
                content += this._handleChatNotificationContentText(message);
                break;
            case false:
                content = '您有' + await TUINotification?.TUICore?.tim?.getTotalUnreadMessageCount() + '条新消息';
                break;
            default:
                break;
        }
        return content;
    }
    async _handleChatNotificationContentTitle(message) {
        let title = '';
        switch (message?.conversationType) {
            case chat_1.default.TYPES.CONV_C2C:
                title = (message?.nick || message?.from) + ': ';
                break;
            case chat_1.default.TYPES.CONV_GROUP:
                title = message?.conversationID + ': ';
                await TUINotification?.TUICore?.tim?.getConversationProfile(message?.conversationID)?.then((imResponse) => {
                    title = (imResponse?.data?.conversation?.groupProfile?.name || message?.conversationID) + ': ';
                }).catch(() => {
                    title = message?.conversationID + ': ';
                });
                break;
            case chat_1.default.TYPES.CONV_SYSTEM:
                title = '系统消息: ';
                break;
            default:
                break;
        }
        return title;
    }
    _handleChatNotificationContentText(message) {
        console.log("🔥🔥🔥🚀 ~ file: index.ts:219 ~ message:", message);
        let content = '';
        switch (message.type) {
            case chat_1.default.TYPES.MSG_TEXT:
                content += message?.payload?.text;
                break;
            case chat_1.default.TYPES.MSG_CUSTOM:
                if (message?.payload?.data !== undefined) {
                    const { title } = (0, utils_1.JSONToObject)(message?.payload?.data);
                    content += title;
                    break;
                }
                content += '[自定义消息123]';
                break;
            case chat_1.default.TYPES.MSG_IMAGE:
                content += '[图片]';
                break;
            case chat_1.default.TYPES.MSG_AUDIO:
                content += '[语音]';
                break;
            case chat_1.default.TYPES.MSG_VIDEO:
                content += '[视频]';
                break;
            case chat_1.default.TYPES.MSG_FILE:
                content += '[文件]';
                break;
            case chat_1.default.TYPES.MSG_FACE:
                content += '[表情]';
                break;
            case chat_1.default.TYPES.MSG_MERGER:
                content += '[聊天记录]';
                break;
            case chat_1.default.TYPES.MSG_LOCATION:
                content += '[位置]';
                break;
            default:
                break;
        }
        return content;
    }
    _handleCallNotificationContent(message) {
        let content = '';
        let callEnd = false;
        try {
            if (message.type === chat_1.default.TYPES.MSG_CUSTOM) {
                const callInfo = (0, utils_1.JSONToObject)(message?.payload?.data);
                const callDataInfo = (0, utils_1.JSONToObject)(callInfo.data);
                if (callInfo?.businessID === 1) {
                    if (callInfo.actionType === 1 && ((callInfo.groupID && callInfo.timeout > 0) ||
                        ((!callInfo.call_end && callInfo.call_end !== 0) &&
                            !callInfo.groupID &&
                            !(callDataInfo?.data && (callDataInfo?.data.cmd === 'switchToAudio' || callDataInfo?.data.cmd === 'switchToVideo'))))) {
                        content = this.showPreviews ? `${callInfo.inviter} 发起通话` : `您有一个通话请求`;
                        callEnd = false;
                    }
                    else if (callInfo.actionType === 2) {
                        content = this.showPreviews ? `${callInfo.inviter} 取消通话` : `通话取消`;
                        callEnd = true;
                    }
                }
            }
        }
        catch (error) {
            console.warn(error);
        }
        return {
            content,
            callEnd
        };
    }
    checkPageFocus() {
        return document.hasFocus();
    }
}
exports.default = TUINotification;
