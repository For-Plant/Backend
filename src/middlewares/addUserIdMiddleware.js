// src/middlewares/addUserIdMiddleware.js

const addUserIdMiddleware = (req, res, next) => {
    req.member_id = req.body.member_id;
    next();
  };
  
  export default addUserIdMiddleware; // ES 모듈 방식으로 내보내기
  