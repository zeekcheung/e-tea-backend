// TODO: use binary data to store the role
/** 用户角色 */
export enum Role {
  /** 顾客角色 */
  CUSTOMER = 0,
  /** 商家角色 */
  SHOPKEEPER,
  /** 管理员角色 */
  ADMIN,
}

/** 用户性别 */
export enum Sex {
  /** 未知 */
  UNKNOWN = 0,
  /** 男性 */
  MALE,
  /** 女性 */
  FEMALE,
}

/** 商品售卖状态 */
export enum ProductStatus {
  /** 审核中 */
  UNDER_REVIEW = 0,
  /** 售卖中 */
  IN_STOCK,
  /** 已售罄 */
  SOLD_OUT,
  /** 已下架 */
  OFF_SHELF,
}

/** 订单状态 */
export enum OrderStatus {
  /** 待支付 */
  PENDING_PAYMENT = 0,
  /** 待发货 */
  PENDING_DELIVERY,
  /** 待收货 */
  PENDING_RECEIPT,
  /** 待评价 */
  PENDING_EVALUATION,
  /** 已完成 */
  FINISHED,
  /** 已取消 */
  CANCELED,
}

/** 支付方式 */
export enum PaymentMethod {
  /** 微信 */
  WECHAT_PAY = 0,
  /** 支付宝 */
  ALIPAY,
}

/** 就餐方式 */
export enum EatingMethod {
  /** 自取 */
  TAKE_OUT = 0,
  /** 外卖 */
  DELIVERY,
}
