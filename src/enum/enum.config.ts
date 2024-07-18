enum ConfigEnum {
  // 数据库类型 mysql or mongodb or orthe
  DB_TYPE = 'DB_TYPE',

  // 数据库地址
  DB_HOST = 'DB_HOST',

  // 用户名
  DB_USERNAME = 'DB_USERNAME',

  // 端口号
  DB_PORT = 'DB_PORT',

  // 密码
  DB_PASSWORD = 'DB_PASSWORD',

  // 数据库名称
  DB_DATABASE = 'DB_DATABASE',

  // 数据库初始化时是否同步entity?
  DB_SYNC = 'DB_SYNC',

  // 日志类型
  DB_LOGGING = 'DB_LOGGING',
}

export { ConfigEnum };
