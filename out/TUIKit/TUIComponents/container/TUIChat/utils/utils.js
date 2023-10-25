"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSkeletonSize = exports.isMessageTip = exports.throttle = exports.deepCopy = exports.isTypingMessage = exports.JSONToObject = exports.isJSON = exports.handleOptions = exports.isUrl = exports.getImgLoad = exports.translateGroupSystemNotice = exports.handleCustomMessageShowContext = exports.extractCallingInfoFromMessage = exports.handleMergerMessageShowContext = exports.handleFileMessageShowContext = exports.handleAudioMessageShowContext = exports.handleVideoMessageShowContext = exports.handleImageMessageShowContext = exports.handleLocationMessageShowContext = exports.handleFaceMessageShowContext = exports.handleTextMessageShowContext = exports.handleTipMessageShowContext = exports.handleShowLastMessage = exports.handleReferenceForShow = exports.handleAt = exports.handleName = exports.handleAvatar = void 0;
const date_1 = require("../../../utils/date");
const decodeText_1 = require("./decodeText");
const tim_1 = require("../../../../TUICore/tim");
const constant_1 = require("../../constant");
// Handling avatars
function handleAvatar(item) {
    let avatar = '';
    switch (item.type) {
        case tim_1.default.TYPES.CONV_C2C:
            avatar = isUrl(item?.userProfile?.avatar)
                ? item?.userProfile?.avatar
                : 'https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_21.png';
            break;
        case tim_1.default.TYPES.CONV_GROUP:
            avatar = isUrl(item?.groupProfile?.avatar)
                ? item?.groupProfile?.avatar
                : 'https://web.sdk.qcloud.com/im/demo/TUIkit/web/img/constomer.svg';
            break;
        case tim_1.default.TYPES.CONV_SYSTEM:
            avatar = isUrl(item?.groupProfile?.avatar)
                ? item?.groupProfile?.avatar
                : 'https://web.sdk.qcloud.com/component/TUIKit/assets/group_avatar.png';
            break;
    }
    return avatar;
}
exports.handleAvatar = handleAvatar;
// Handling names
function handleName(item) {
    const { t } = window.TUIKitTUICore.config.i18n.useI18n();
    let name = '';
    switch (item.type) {
        case tim_1.default.TYPES.CONV_C2C:
            name = item?.userProfile.nick || item?.userProfile?.userID || '';
            break;
        case tim_1.default.TYPES.CONV_GROUP:
            name = item.groupProfile.name || item?.groupProfile?.groupID || '';
            break;
        case tim_1.default.TYPES.CONV_SYSTEM:
            name = t('系统通知');
            break;
    }
    return name;
}
exports.handleName = handleName;
// Handle whether there is someone@
function handleAt(item) {
    const { t } = window.TUIKitTUICore.config.i18n.useI18n();
    const List = [
        `[${t('TUIConversation.有人@我')}]`,
        `[${t('TUIConversation.@所有人')}]`,
        `[${t('TUIConversation.@所有人')}][${t('TUIConversation.有人@我')}]`,
    ];
    let showAtType = '';
    for (let index = 0; index < item.groupAtInfoList.length; index++) {
        if (item.groupAtInfoList[index].atTypeArray[0] && item.unreadCount > 0) {
            showAtType = List[item.groupAtInfoList[index].atTypeArray[0] - 1];
        }
    }
    return showAtType;
}
exports.handleAt = handleAt;
function handleReferenceForShow(message) {
    console.log("🔥🔥🔥🚀 ~ file: utils.ts:65 ~ message:", message);
    const data = {
        referenceMessageForShow: '',
        referenceMessageType: 0,
    };
    if (!message || !message?.ID || !message?.type)
        return data;
    switch (message.type) {
        case tim_1.default.TYPES.MSG_TEXT:
            data.referenceMessageForShow = message?.payload?.text;
            data.referenceMessageType = 1;
            break;
        case tim_1.default.TYPES.MSG_CUSTOM:
            if (message?.payload.data) {
                const { title } = JSONToObject(message?.payload?.data);
                data.referenceMessageForShow = title;
                data.referenceMessageType = 2;
                break;
            }
            data.referenceMessageForShow = '[自定义消息]';
            data.referenceMessageType = 2;
            break;
        case tim_1.default.TYPES.MSG_IMAGE:
            data.referenceMessageForShow = '[图片]';
            data.referenceMessageType = 3;
            break;
        case tim_1.default.TYPES.MSG_AUDIO:
            data.referenceMessageForShow = '[语音]';
            data.referenceMessageType = 4;
            break;
        case tim_1.default.TYPES.MSG_VIDEO:
            data.referenceMessageForShow = '[视频]';
            data.referenceMessageType = 5;
            break;
        case tim_1.default.TYPES.MSG_FILE:
            data.referenceMessageForShow = '[文件]';
            data.referenceMessageType = 6;
            break;
        case tim_1.default.TYPES.MSG_FACE:
            data.referenceMessageForShow = '[表情]';
            data.referenceMessageType = 8;
            break;
    }
    return data;
}
exports.handleReferenceForShow = handleReferenceForShow;
// Internal display of processing message box
function handleShowLastMessage(item) {
    const { t } = window.TUIKitTUICore.config.i18n.useI18n();
    const { lastMessage } = item;
    const conversation = item;
    let showNick = '';
    let lastMessagePayload = '';
    // Judge the number of unread messages and display them only when the message is enabled without interruption.
    const showUnreadCount = conversation.unreadCount > 0 &&
        conversation.messageRemindType === tim_1.default.TYPES.MSG_REMIND_ACPT_NOT_NOTE
        ? `[${conversation.unreadCount > 99 ? "99+" : conversation.unreadCount}${t('TUIConversation.条')}] `
        : "";
    // Determine the lastmessage sender of the group. Namecard / Nick / userid is displayed by priority
    if (conversation.type === tim_1.default.TYPES.CONV_GROUP) {
        if (lastMessage.fromAccount === conversation.groupProfile.selfInfo.userID) {
            showNick = t('TUIConversation.我');
        }
        else {
            showNick = lastMessage.nameCard || lastMessage.nick || lastMessage.fromAccount;
        }
    }
    // Display content of lastmessage message body
    if (lastMessage.type === tim_1.default.TYPES.MSG_TEXT) {
        lastMessagePayload = lastMessage.payload.text;
    }
    else if (lastMessage.type === tim_1.default.TYPES.MSG_CUSTOM) {
        const data = JSONToObject(lastMessage?.payload?.data);
        if (data?.businessID === 1) {
            lastMessagePayload = extractCallingInfoFromMessage(lastMessage);
            return lastMessagePayload;
        }
        lastMessagePayload = lastMessage.messageForShow;
    }
    else {
        lastMessagePayload = lastMessage.messageForShow;
    }
    if (lastMessage.isRevoked) {
        lastMessagePayload = t('TUIChat.撤回了一条消息');
    }
    if (conversation.type === tim_1.default.TYPES.CONV_GROUP && lastMessage.type === tim_1.default.TYPES.MSG_GRP_TIP) {
        return lastMessagePayload;
    }
    // Specific display content of message box
    return `${showUnreadCount}${showNick ? `${showNick}:` : ''}${lastMessagePayload}`;
}
exports.handleShowLastMessage = handleShowLastMessage;
// Handling system tip message display
function handleTipMessageShowContext(message) {
    const { t } = window.TUIKitTUICore.config.i18n.useI18n();
    const options = {
        message,
        text: '',
    };
    let userName = message?.nick || message?.payload?.userIDList?.join(',');
    if (message?.payload?.memberList?.length > 0) {
        userName = '';
        message?.payload?.memberList?.map((user) => {
            userName += `${user?.nick || user?.userID},`;
        });
        userName = userName?.slice(0, -1);
    }
    if (message?.type === tim_1.default?.TYPES?.MSG_GRP_TIP) {
        switch (message.payload.operationType) {
            case tim_1.default.TYPES.GRP_TIP_MBR_JOIN:
                options.text = `${userName} ${t('message.tip.加入群组')}`;
                break;
            case tim_1.default.TYPES.GRP_TIP_MBR_QUIT:
                options.text = `${t('message.tip.群成员')}：${userName} ${t('message.tip.退出群组')}`;
                break;
            case tim_1.default.TYPES.GRP_TIP_MBR_KICKED_OUT:
                options.text = `${t('message.tip.群成员')}：${userName} ${t('message.tip.被')}${message.payload.operatorID}${t('message.tip.踢出群组')}`;
                break;
            case tim_1.default.TYPES.GRP_TIP_MBR_SET_ADMIN:
                options.text = `${t('message.tip.群成员')}：${userName} ${t('message.tip.成为管理员')}`;
                break;
            case tim_1.default.TYPES.GRP_TIP_MBR_CANCELED_ADMIN:
                options.text = `${t('message.tip.群成员')}：${userName} ${t('message.tip.被撤销管理员')}`;
                break;
            case tim_1.default.TYPES.GRP_TIP_GRP_PROFILE_UPDATED:
                // options.text =  `${userName} 修改群组资料`;
                options.text = handleTipGrpUpdated(message);
                break;
            case tim_1.default.TYPES.GRP_TIP_MBR_PROFILE_UPDATED:
                for (const member of message.payload.memberList) {
                    if (member.muteTime > 0) {
                        options.text = `${t('message.tip.群成员')}：${member.userID}${t('message.tip.被禁言')}`;
                    }
                    else {
                        options.text = `${t('message.tip.群成员')}：${member.userID}${t('message.tip.被取消禁言')}`;
                    }
                }
                break;
            default:
                options.text = `[${t('message.tip.群提示消息')}]`;
                break;
        }
    }
    else if (JSONToObject(message?.payload?.data)?.businessID === "group_create") {
        const data = JSONToObject(message?.payload?.data);
        options.text = `"${data?.opUser}" ` + t(data?.content);
    }
    else {
        options.text = extractCallingInfoFromMessage(message);
    }
    return options;
}
exports.handleTipMessageShowContext = handleTipMessageShowContext;
function handleTipGrpUpdated(message) {
    const { t } = window.TUIKitTUICore.config.i18n.useI18n();
    const { payload } = message;
    const { newGroupProfile } = payload;
    const { operatorID } = payload;
    let text = "";
    if ("muteAllMembers" in newGroupProfile) {
        if (newGroupProfile["muteAllMembers"]) {
            text = `${t("message.tip.管理员")} ${operatorID} ${t("message.tip.开启全员禁言")}`;
        }
        else {
            text = `${t("message.tip.管理员")} ${operatorID} ${t("message.tip.取消全员禁言")}`;
        }
    }
    else if ("ownerID" in newGroupProfile) {
        text = `${newGroupProfile["ownerID"]} ${t("message.tip.成为新的群主")}`;
    }
    else if ("groupName" in newGroupProfile) {
        text = `${operatorID} ${t("message.tip.修改群名为")} ${newGroupProfile["groupName"]}`;
    }
    else if ("notification" in newGroupProfile) {
        text = `${operatorID} ${t("message.tip.发布新公告")}`;
    }
    return text;
}
// Parsing and handling text message display
function handleTextMessageShowContext(item) {
    const options = {
        text: (0, decodeText_1.decodeText)(item.payload),
    };
    return options;
}
exports.handleTextMessageShowContext = handleTextMessageShowContext;
// Parsing and handling face message display
function handleFaceMessageShowContext(item) {
    const face = {
        message: item,
        name: '',
        url: '',
    };
    face.name = item.payload.data;
    if (item.payload.data.indexOf('@2x') < 0) {
        face.name = `${face.name}@2x`;
    }
    face.url = `https://web.sdk.qcloud.com/im/assets/face-elem/${face.name}.png`;
    return face;
}
exports.handleFaceMessageShowContext = handleFaceMessageShowContext;
// Parsing and handling location message display
function handleLocationMessageShowContext(item) {
    const location = {
        lon: '',
        lat: '',
        href: '',
        url: '',
        description: '',
        message: item,
    };
    location.lon = item.payload.longitude.toFixed(6);
    location.lat = item.payload.latitude.toFixed(6);
    location.href =
        'https://map.qq.com/?type=marker&isopeninfowin=1&markertype=1&' +
            `pointx=${location.lon}&pointy=${location.lat}&name=${item.payload.description}`;
    location.url =
        'https://apis.map.qq.com/ws/staticmap/v2/?' +
            `center=${location.lat},${location.lon}&zoom=10&size=300*150&maptype=roadmap&` +
            `markers=size:large|color:0xFFCCFF|label:k|${location.lat},${location.lon}&` +
            'key=UBNBZ-PTP3P-TE7DB-LHRTI-Y4YLE-VWBBD';
    location.description = item.payload.description;
    return location;
}
exports.handleLocationMessageShowContext = handleLocationMessageShowContext;
// Parsing and handling image message display
function handleImageMessageShowContext(item) {
    return {
        progress: item?.status === 'unSend' && item.progress,
        url: item.payload.imageInfoArray[1].url,
        width: item.payload.imageInfoArray[0].width,
        height: item.payload.imageInfoArray[0].height,
        message: item,
    };
}
exports.handleImageMessageShowContext = handleImageMessageShowContext;
// Parsing and handling video message display
function handleVideoMessageShowContext(item) {
    return {
        progress: item?.status === 'unSend' && item?.progress,
        url: item?.payload?.videoUrl,
        snapshotUrl: item?.payload?.snapshotUrl,
        snapshotWidth: item?.payload?.snapshotWidth,
        snapshotHeight: item?.payload?.snapshotHeight,
        message: item,
    };
}
exports.handleVideoMessageShowContext = handleVideoMessageShowContext;
// Parsing and handling audio message display
function handleAudioMessageShowContext(item) {
    return {
        progress: item?.status === 'unSend' && item.progress,
        url: item.payload.url,
        message: item,
        second: item.payload.second,
    };
}
exports.handleAudioMessageShowContext = handleAudioMessageShowContext;
// Parsing and handling file message display
function handleFileMessageShowContext(item) {
    let size = '';
    if (item.payload.fileSize >= 1024 * 1024) {
        size = `${(item.payload.fileSize / (1024 * 1024)).toFixed(2)} Mb`;
    }
    else if (item.payload.fileSize >= 1024) {
        size = `${(item.payload.fileSize / 1024).toFixed(2)} Kb`;
    }
    else {
        size = `${item.payload.fileSize.toFixed(2)}B`;
    }
    return {
        progress: item?.status === 'unSend' && item.progress,
        url: item.payload.fileUrl,
        message: item,
        name: item.payload.fileName,
        size,
    };
}
exports.handleFileMessageShowContext = handleFileMessageShowContext;
// Parsing and handling merger message display
function handleMergerMessageShowContext(item) {
    return { message: item, ...item.payload };
}
exports.handleMergerMessageShowContext = handleMergerMessageShowContext;
// Parse audio and video call messages
function extractCallingInfoFromMessage(message) {
    const { t } = window.TUIKitTUICore.config.i18n.useI18n();
    let callingMessage = {};
    let objectData = {};
    try {
        callingMessage = JSONToObject(message?.payload?.data);
    }
    catch (error) {
        callingMessage = {};
    }
    if (callingMessage.businessID !== 1) {
        return '';
    }
    try {
        objectData = JSONToObject(callingMessage.data);
    }
    catch (error) {
        objectData = {};
    }
    let inviteeList = '';
    callingMessage?.inviteeList?.forEach((userID, index) => {
        if (index < callingMessage?.inviteeList?.length - 1) {
            inviteeList += `"${userID}"、`;
        }
        else {
            inviteeList += `"${userID}" `;
        }
    });
    const inviter = `"${callingMessage?.inviter}" `;
    switch (callingMessage.actionType) {
        case 1: {
            if (objectData.call_end >= 0 && !callingMessage.groupID) {
                return `${t('message.custom.通话时长')}：${(0, date_1.formatTime)(objectData.call_end)}`;
            }
            if (callingMessage.groupID && callingMessage.timeout > 0) {
                return `${inviter}${t('message.custom.发起通话')}`;
            }
            if (callingMessage.groupID) {
                return `${t('message.custom.结束群聊')}`;
            }
            if (objectData.data && objectData.data.cmd === 'switchToAudio') {
                return `${t('message.custom.切换语音通话')}`;
            }
            if (objectData.data && objectData.data.cmd === 'switchToVideo') {
                return `${t('message.custom.切换视频通话')}`;
            }
            return `${t('message.custom.发起通话')}`;
        }
        case 2:
            return `${callingMessage.groupID ? inviter : ''}${t('message.custom.取消通话')}`;
        case 3:
            if (objectData.data && objectData.data.cmd === 'switchToAudio') {
                return `${t('message.custom.切换语音通话')}`;
            }
            if (objectData.data && objectData.data.cmd === 'switchToVideo') {
                return `${t('message.custom.切换视频通话')}`;
            }
            return `${callingMessage.groupID ? inviteeList : ''}${t('message.custom.已接听')}`;
        case 4:
            return `${callingMessage.groupID ? inviteeList : ''}${t('message.custom.拒绝通话')}`;
        case 5:
            if (objectData.data && objectData.data.cmd === 'switchToAudio') {
                return `${t('message.custom.切换语音通话')}`;
            }
            if (objectData.data && objectData.data.cmd === 'switchToVideo') {
                return `${t('message.custom.切换视频通话')}`;
            }
            return `${callingMessage.groupID ? inviteeList : ''}${t('message.custom.无应答')}`;
        default:
            return '';
    }
}
exports.extractCallingInfoFromMessage = extractCallingInfoFromMessage;
// Parsing and handling custom message display
function handleCustomMessageShowContext(item) {
    const { t } = window.TUIKitTUICore.config.i18n.useI18n();
    const payloadObj = JSONToObject(item?.payload?.data);
    if (payloadObj?.businessID === constant_1.default.typeEvaluate) {
        if (!(payloadObj?.score > 0)) {
            payloadObj.score = 1;
            item.payload.data = JSON.stringify(payloadObj);
        }
    }
    return {
        message: item,
        custom: extractCallingInfoFromMessage(item) || `[${t('message.custom.自定义消息')}]`,
    };
}
exports.handleCustomMessageShowContext = handleCustomMessageShowContext;
// Parsing and handling system message display
function translateGroupSystemNotice(message) {
    const { t } = window.TUIKitTUICore.config.i18n.useI18n();
    const groupName = message.payload.groupProfile.name || message.payload.groupProfile.groupID;
    switch (message.payload.operationType) {
        case 1:
            return `${message.payload.operatorID} ${t('message.tip.申请加入群组')}：${groupName}`;
        case 2:
            return `${t('message.tip.成功加入群组')}：${groupName}`;
        case 3:
            return `${t('message.tip.申请加入群组')}：${groupName} ${t('message.tip.被拒绝')}`;
        case 4:
            return `${t('message.tip.你被管理员')}${message.payload.operatorID} ${t('message.tip.踢出群组')}：${groupName}`;
        case 5:
            return `${t('message.tip.群')}：${groupName} ${t('message.tip.被')} ${message.payload.operatorID} ${t('message.tip.解散')}`;
        case 6:
            return `${message.payload.operatorID} ${t('message.tip.创建群')}：${groupName}`;
        case 7:
            return `${message.payload.operatorID} ${t('message.tip.邀请你加群')}：${groupName}`;
        case 8:
            return `${t('message.tip.你退出群组')}：${groupName}`;
        case 9:
            return `${t('message.tip.你被')}${message.payload.operatorID} ${t('message.tip.设置为群')}：${groupName} ${t('message.tip.的管理员')}`;
        case 10:
            return `${t('message.tip.你被')}${message.payload.operatorID} ${t('message.tip.撤销群')}：${groupName} ${t('message.tip.的管理员身份')}`;
        case 12:
            return `${message.payload.operatorID} ${t('message.tip.邀请你加群')}：${groupName}`;
        case 13:
            return `${message.payload.operatorID} ${t('message.tip.同意加群')}：${groupName}`;
        case 14:
            return `${message.payload.operatorID} ${t('message.tip.拒接加群')}：${groupName}`;
        case 255:
            return `${t('message.tip.自定义群系统通知')}: ${message.payload.userDefinedField}`;
    }
}
exports.translateGroupSystemNotice = translateGroupSystemNotice;
// Image loading complete
function getImgLoad(container, className, callback) {
    const images = container?.querySelectorAll(`.${className}`) || [];
    const promiseList = Array.prototype.slice.call(images).map((node) => {
        return new Promise((resolve, reject) => {
            node.onload = () => {
                resolve(node);
            };
            node.onloadeddata = () => {
                resolve(node);
            };
            node.onprogress = () => {
                resolve(node);
            };
            if (node.complete) {
                resolve(node);
            }
        });
    });
    return Promise.all(promiseList)
        .then(() => {
        callback && callback();
    })
        .catch((e) => {
        console.error('网络异常', e);
    });
}
exports.getImgLoad = getImgLoad;
// Determine whether it is url
function isUrl(url) {
    return /^(https?:\/\/(([a-zA-Z0-9]+-?)+[a-zA-Z0-9]+\.)+[a-zA-Z]+)(:\d+)?(\/.*)?(\?.*)?(#.*)?$/.test(url);
}
exports.isUrl = isUrl;
// Handling custom message options
function handleOptions(businessID, version, other) {
    return {
        businessID,
        version,
        ...other,
    };
}
exports.handleOptions = handleOptions;
// Determine if it is a JSON string
function isJSON(str) {
    // eslint-disable-next-line no-useless-escape
    if (typeof str === 'string') {
        try {
            const data = JSON.parse(str);
            if (data) {
                return true;
            }
            return false;
        }
        catch (error) {
            return false;
        }
    }
    return false;
}
exports.isJSON = isJSON;
// Determine if it is a JSON string
function JSONToObject(str) {
    if (!str || !isJSON(str)) {
        return str;
    }
    return JSON.parse(str);
}
exports.JSONToObject = JSONToObject;
// Determine if it is a typing message
function isTypingMessage(item) {
    if (!item)
        return false;
    try {
        const { businessID } = JSONToObject(item?.payload?.data);
        if (businessID === constant_1.default.typeUserTyping)
            return true;
    }
    catch {
        return false;
    }
    return false;
}
exports.isTypingMessage = isTypingMessage;
function deepCopy(data, hash = new WeakMap()) {
    if (typeof data !== 'object' || data === null) {
        throw new TypeError('传入参数不是对象');
    }
    if (hash.has(data)) {
        return hash.get(data);
    }
    const newData = Object.create(Object.getPrototypeOf(data));
    const dataKeys = Object.keys(data);
    dataKeys.forEach((value) => {
        const currentDataValue = data[value];
        if (typeof currentDataValue !== 'object' || currentDataValue === null) {
            newData[value] = currentDataValue;
        }
        else if (Array.isArray(currentDataValue)) {
            newData[value] = [...currentDataValue];
        }
        else if (currentDataValue instanceof Set) {
            newData[value] = new Set([...currentDataValue]);
        }
        else if (currentDataValue instanceof Map) {
            newData[value] = new Map([...currentDataValue]);
        }
        else {
            hash.set(data, data);
            newData[value] = deepCopy(currentDataValue, hash);
        }
    });
    return newData;
}
exports.deepCopy = deepCopy;
const throttle = (fn) => {
    let isRunning = false;
    return (...args) => {
        if (isRunning)
            return;
        setTimeout(() => {
            fn.apply(this, args);
            isRunning = false;
        }, 100);
    };
};
exports.throttle = throttle;
const isMessageTip = (message) => {
    if (message?.type === tim_1.default?.TYPES?.MSG_GRP_TIP ||
        (message?.type === tim_1.default?.TYPES?.MSG_CUSTOM &&
            message?.conversationType === tim_1.default?.TYPES?.CONV_GROUP &&
            JSONToObject(message?.payload?.data)?.businessID === constant_1.default?.TYPE_CALL_MESSAGE) ||
        (message?.type === tim_1.default?.TYPES?.MSG_CUSTOM &&
            message?.conversationType === tim_1.default?.TYPES?.CONV_GROUP &&
            JSONToObject(message?.payload?.data)?.businessID === "group_create")) {
        return true;
    }
    return false;
};
exports.isMessageTip = isMessageTip;
const handleSkeletonSize = (width, height, maxWidth, maxHeight) => {
    const widthToHeight = width / height;
    const maxWidthToHeight = maxWidth / maxHeight;
    if (width <= maxWidth && height <= maxHeight) {
        return { width, height };
    }
    else if ((width <= maxWidth && height > maxHeight) ||
        (width > maxWidth && height > maxHeight && widthToHeight <= maxWidthToHeight)) {
        return { width: width * (maxHeight / height), height: maxHeight };
    }
    else {
        return { width: maxWidth, height: height * (maxWidth / width) };
    }
};
exports.handleSkeletonSize = handleSkeletonSize;
