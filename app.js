const express=require('express');
const app=express();
const path=require('path');
const Youch=require('youch');
const artTemplate=require('express-art-template');
const createError=require('http-errors');
const favicon=require('express-favicon');

// 中间件处理函数
//处理静态资源
app.use('/',express.static(path.join(__dirname,'public')));
//配置模板引擎art-template
app.engine('art',artTemplate);

//设置在生产模式中,不是压缩的代码
app.set('view options', {debug: process.env.NODE_ENV === 'development'});
//小图标统一特殊处理,也是express的方法
app.use(favicon(path.join(__dirname,'favicon.ico')));
// 定义业务路由,写一个服务器错误
app.get('/',(req,res,next)=>{
    //写一个错误代码然后传入到错误处理程序中,一共有三种写法第一种是
    // const error=new Error();
    // error.status=500;
    // next(error);
    // 第二种是throw new Error('自己抛出的异常').status=500;
    // 第三种是throw createError(500,'serverError');使用第三种写法
    throw createError(500,'serverError')
    // res.send('<p>some html</p>');
});
//写一个浏览器找不到的404错误,如果走到这个中间件,证明所以url都不符合条件
app.use((req,res,next)=>{
    const error = new Error('Not Found')
  error.status = 404
  next(error);
    // next(createError(404,'notdefinde'));
});
//统一错误处理中间件
app.use((err,req,res,next)=>{
    //1.错误处理思路,首先,判断是在development开发模式还是production生产模式,const env=req.app.get('env')获取系统的环境变量如果是开发模式能够直观的观察到异常信息准确的定位到错误代码的代码使用youch这个包

    const env=req.app.get('env');
    if(env==='development'){
        new Youch(err,req).toHTML().then((html)=>res.send(html))
    }
    //2如果是生成环境也就是上线的环境,这时候要考虑到两种情况,第一种情况是服务器错误404,第二种情况是500服务器出错,这个时候就需要在生产模式的情况下取出返回的状态码,取状态码需要
    else{
        res.render('error.art',{status:err.status})
    }
});


app.listen(3000,()=>{
    console.log('正在监听端口3000');
});