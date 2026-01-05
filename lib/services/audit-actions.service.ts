export const AuditAction = {
    // Auth
    LOGIN_SUCCESS: "LOGIN_SUCCESS",
    LOGIN_FAILED: "LOGIN_FAILED",
    LOGOUT: "LOGOUT",

    // Users / roles
    CREATE_USER: "CREATE_USER",
    UPDATE_USER: "UPDATE_USER",
    DELETE_USER: "DELETE_USER",
    CHANGE_ROLE: "CHANGE_ROLE",

    // Projects
    CREATE_PROJECT: "CREATE_PROJECT",
    UPDATE_PROJECT: "UPDATE_PROJECT",
    DELETE_PROJECT: "DELETE_PROJECT",
    PROJECT_ADD_MEMBER: "PROJECT_ADD_MEMBER",
    PROJECT_REMOVE_MEMBER: "PROJECT_REMOVE_MEMBER",
    PROJECT_CHANGE_MEMBER_ROLE: "PROJECT_CHANGE_MEMBER_ROLE",

    // Attachments
    UPLOAD_ATTACHMENT: "UPLOAD_ATTACHMENT",
    DOWNLOAD_ATTACHMENT: "DOWNLOAD_ATTACHMENT",
    DELETE_ATTACHMENT: "DELETE_ATTACHMENT",

    // Security
    ACCESS_DENIED: "ACCESS_DENIED",
    VALIDATION_FAILED: "VALIDATION_FAILED",
    SERVER_ERROR: "SERVER_ERROR",
} as const;

export type AuditActionType = (typeof AuditAction)[keyof typeof AuditAction];

export const AuditResource = {
    AUTH: "auth",
    USER: "user",
    PROJECT: "project",
    ATTACHMENT: "attachment",
    UI: "ui",
} as const;

export type AuditResourceType = (typeof AuditResource)[keyof typeof AuditResource];
