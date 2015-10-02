0.0 先不管用户系统，把userId默认为1即可

0.1 所有变量命名采用小驼峰法,类似 userId

0.2 utf8

0.3 需要登录的接口都会有get参数:token=xxxxxxxx ,通过token判断是否登录

0.4 接口统一返回格式:

	{
	code:200,    //成功则为0,失败为相应的错误码
	message:"提示信息",  //成功可省略,失败为错误提示信息
	data:{}     //可以为空
	}
	
0.5 匿名如果在评论区的话，可识别为作者

0.6 同一个帖子下,作者只能为一种身份 实名/匿名

0.7 实名不可转匿名，反之可以

0.8 判断title

### 1.新增一个帖子接口

    //如果是匿名的情况下，插入一个随机的avatar,和一个昵称 '某同学'
	{
	method:"post"
	
	url:"/api/post"
	
	params:{
	secret:0/1 //是否匿名
	content:"内容"
	}

	}


### 2.删除一个帖子接口

	{
	method:"delete"
	url:"/api/post"
	params:{
	id:2
	}
	}
	
### 3.帖子列表

    {
    method:"get",
    url:"/api/posts"
    params:{
    pageSize:15 //请求的文章数
    fromId:53  //从第53个文章id往前的15篇文章
    userId:23 //如果有这个字段则返回 该人的帖子列表
    //待定参数
     
    }
    }

    return:{
    code:0,
    data:[

    {
    id:12,
    top:0/1 ,//是否置顶
    title:"xxx",
    gender:0/1 ,  //性别
    avatar:""  , //头像
    nickname:"" ,//昵称
    secret:"0/1",
    more:"0/1",//是否有更多内容
    like:"0/1",//如果点过赞则为1
    author:"0/1",
    admin:"0/1",
    commentCount:13 ,//评论数量
    likeCount:12 ,//点赞数量
    date:12343214321,  //时间戳
    userId:0/3  //作者id，如果是实名则返回作者id，否则为0
    }
    ]

    }
    }

### 4.帖子详情

    {
    method:"get",
    url:"/api/post",
    params:{
    id:12
    }
    }

    return:

    {
        id:12,
           title:"xxx",
           gender:0/1 ,  //性别
           avatar:""  , //头像
           nickname:"" ,//昵称
           secret:"0/1",
           more:"0/1",//是否有更多内容
           like:"0/1",//如果点过赞则为1
           author:"0/1",
           admin:"0/1",
           commentCount:13 ,//评论数量
           likeCount:12 ,//点赞数量
           date:12343214321,  //时间戳
           userId:0/3  //作者id，如果是实名则返回作者id，否则为0
        }
    
### 5.发布一条评论

    {
    method:"post"
    url:"/api/comment"
    params:{
    postId:3,
    secret:true/false,//是否匿名
    parentId:"",//父id，如果直接评论，则默认0，若回复某个评论则为某评论的id
    content:"评论内容"
    }
    }
    
### 6.删除一条评论
	{
	method:"delete"
	url:"/api/comment",
	params:{
	id:23
	}
	}
	
	
### 7.评论列表


    {
    method:"get",
    url:"/api/comments"  //文章
    params:{
    postId:12，
    pageSize:15 //请求的评论数
    fromId:从第几条起的评论 
    
    
    //待定参数
     
    }
    
    return:{
    code:200,
    data:[
    {
    id:23,
    parentId:22,
    isAuthor:0/1, //是否为作者
    admin:"0/1",
    postId:1,
    content:"xxxxxx",
    date:12314321432,
    secret:0/1,  //是否匿名
    like:0/1,   //是否赞过
    userId:0/3
    avatar:"",
    nickname:"",
    gender:""
    likeCount:2 //点赞数量
    
    
    }
    
    ]
    }
    }
    
### 8.评论详情


    {
    method:"get",
    url:"/api/comment",
    params:{
    id:322  //评论id
    
    }
    
    return:
    
       {
        id:23,
            parentId:22,
            isAuthor:0/1, //是否为作者
            admin:"0/1",
            postId:1,
            content:"xxxxxx",
            date:12314321432,
            secret:0/1,  //是否匿名
            like:0/1,   //是否赞过
            userId:0/3
            avatar:"",
            nickname:"",
            gender:""
            likeCount:2 //点赞数量
        
        }
    }
    
### 9.给某帖子点赞
    {
    method:"post",
    url:"/api/like/post"
    params:{
    id:12
    }
    }
    
### 10.给某评论点赞
    {
    method:"post",
    url:"/api/like/comment",
    params:{
    id:"3"
    }
    }
### 9.1.给某帖子取消点赞
    {
    method:"delete",
    url:"/api/like/post",
    params:{
    id:"3"
    }
    }
    
### 10.1.给某评论取消点赞
    {
    method:"delete",
    url:"/api/like/comment",
    params:{
    id:"3"
    }
    }
### 11.帖子匿名转实名

//同一帖子下的该作者的评论都转为实名

    {
    method:"put",
    url:"/api/status/post",
    params:{
    id:"2"
    }
    }
    
### 12.评论匿名转实名
//同一个帖子下的该作者的所有评论均转为实名

    {
    method:"put",
    url:"/api/status/comment",
    params:{
    id:"2"
    }
    }

### 13.标签列表
    {
    method:"get",
    url:"/api/tags,
    params:{
    
    pageSize:15,
    fromId:"2"
    
    }
    return;{
    code:200,
    data:[
    
    {id:1,
     name:'test1'},
      {id:2,
          name:'test2'},
           {id:3,
               name:'test3'},
                {id:4,
                    name:'test4'}
     
     ]
    }
    }
    
### 14.标签查找帖子列表
    {
    method:"get",
    url:"/api/tag",
    params:{
    
    name:"test1",
    pageSize:15,
    fromId:2
    
    }
    
    
     return:{
        code:0,
        data:[
    
        {
        id:12,
            title:"xxx",
            gender:0/1 ,  //性别
            avatar:""  , //头像
            nickname:"" ,//昵称
            secret:"0/1",
            admin:"0/1",
            more:"0/1",//是否有更多内容
            like:"0/1",//如果点过赞则为1
            author:"0/1",
            commentCount:13 ,//评论数量
            likeCount:12 ,//点赞数量
            date:12343214321,  //时间戳
            userId:0/3  //作者id，如果是实名则返回作者id，否则为0
        }
        ]
    
        }
    }
    
### 15.赞过的帖子接口

     {
     method:"get",
     url:"/api/posts/like"
    params:{
    pageSize:15 //请求的文章数
    fromId:53  //从第53个文章id往前的15篇文章
    userId:23  *必填
    //待定参数
     
    }
    }

    return:{
    code:0,
    data:[

    {
        id:12,
            title:"xxx",
            gender:0/1 ,  //性别
            avatar:""  , //头像
            nickname:"" ,//昵称
            secret:"0/1",
            more:"0/1",//是否有更多内容
            like:"0/1",//如果点过赞则为1
            author:"0/1",
            admin:"0/1",
            commentCount:13 ,//评论数量
            likeCount:12 ,//点赞数量
            date:12343214321,  //时间戳
            userId:0/3  //作者id，如果是实名则返回作者id，否则为0
        }
    ]

    }
    
    
### 16.某某某的个人数据

    {
     method:"get",
     url:"/api/profile/"
    params:{
    userId:23  //如果没有此参数，则返回当前登录用户的个人数据，如果没有登录，则返回错误{"xxx":"请先登录"}
    //待定参数
     
    }
    }

    return:{
    code:200,
    data:

    {
        postsCount:21 //发布的文章总数
        likePostsCount:23 //赞过的文章总数
        avatar:"http://xxx.jpg",
        nickname:"小米",
        gender:"0"

        /*待定的
        scenes:[
        {
        'key':"score",
        'name':"成绩"
        
        }
        ],
        myScenes[
        'score'
        ]
        */
        
        }
    

    }
    
    
    ### 17.获取某个标签的文章数
    
        {
         method:"get",
         url:"/api/tag/count"
        params:{
        name: //标签名
         start://时间戳  可选，开始的时间戳
         end://时间戳 可选，结束的事件戳
        }
        }
    
        return:{
        code:200,
        data:
    
        {
            postsCount:21 //文章总数
      
            }
        
    
        }
        
        ### 18.获取当前登录用户的通知数
        
        {
        method:"get",
        url:"/api/notice/count",
        
        params:{
        
        type:"all"  //默认是all
        
        },
        
        return:{
        
        code:200,
        
        data:{
        
        likeCount:12,
        replyCount:13,
        count:25
        
        }
        
        }
        
        }


        ### 19.获取当前登录用户的通知列表
                
        {
        method:"get",
        url:"/api/notices",
        params:{
        type:"all,like,reply"  //默认是all
         },
         return:{
         code:200,
         data:[
         {
          userId:"adsfsadfsadf" ,
          authorId:"2",
          nickname:"小明",
          action:"replyPost,replyComment,likePost,likeComment",
          content:"『三天之内必有血光之灾』",
          originContent:"你妈炸了",
          postId:32,  //回复的帖子id
          status:1  //1为未读,0为已读
          [
          //根据类型
          parentCommentId:321,   //仅类型为 replyComment,likeComment 有
          commentId:32,    //仅类型为  replyPost,replyComment有
          ]
          }
          ]
          }
          }


          ### 20.标记通知为已读，未读状态

          {
          method:"get",
          url:"/api/notice/status"
          params:{
          type:"single,multiply,all",single为单条通知,multiply为多条通知,all为全部通知,默认为single,
          id:"23" //需要标记的通知id 如果为 multiply则为数组，如果为 all 则无，
          action:"0/1",1为标为未读，0为已读
          }
          return:{
          code:200
          }
          }
          
          ### 21.绑定学号密码
          
          {
          method:"post",
          url:"/api/bind/dean",
          params:{
          studentId:2012141442029,
          password:013991
          }
          }
