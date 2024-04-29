import { Dispatch, SetStateAction } from "react"


export type typeGottenUsers = {
    name:string,
    id:string,
    imageURL:string,
    email:string,
}

//   map(arg0: (item: typeMessagesFromGetMessagesAndInfo, indexNum: number) => string | undefined): import("react").ReactNode
export type typeMessagesFromGetMessagesAndInfo = {
    // length?: number
    // map?: any
    // filter(arg0: (item: typeMessagesFromGetMessagesAndInfo, indexNum: number) => string | undefined): import("react").ReactNode
 
    messageText:string,
    email:string,
    id:string | number,
    imageMsg:string,
    name:string,
    time:string
} 
//  map(arg0: (item: typeMessagesFromGetMessagesAndInfo, indexNum: number) => string | undefined): import("react").ReactNode
export type TypeOfMessage = {
    messageText:string,
    imageMsg?:any| null,
    date:string
}

export type typeGetMessagesAndInfos = {
    usersInfos:typeGottenUsers[],
    messages:typeMessagesFromGetMessagesAndInfo[]
}


export type SecondContext = {
searchUser:string,
setSearchUser:React.Dispatch<React.SetStateAction<string>>,
handleSearch:(event:React.SyntheticEvent)=>void,
usersGotten:typeGottenUsers[],
 setUsersGotten:React.Dispatch<React.SetStateAction<typeGottenUsers[]>>,
message:TypeOfMessage,
setMessage:React.Dispatch<React.SetStateAction<TypeOfMessage>>,
handleMessageSent:(event:React.SyntheticEvent)=>void,
handleSearchedUserClicked:(userFound:typeGottenUsers)=>void,
userMessageToDisplayID:string,
setUserMessagToDisplayeID:React.Dispatch<React.SetStateAction<string>>,
getLastMessage:typeMessagesFromGetMessagesAndInfo[][],
setGetLastMessage:React.Dispatch<React.SetStateAction<typeMessagesFromGetMessagesAndInfo[][]>>,
 chatsUsersInfos:typeGottenUsers[],
 setChatsUsersInfos:React.Dispatch<React.SetStateAction<typeGottenUsers[]>>,
 getAllMyChats:{},
setGetAllMyChats:React.Dispatch<any>,
messagesToDisplay:typeMessagesFromGetMessagesAndInfo[],
setMessagesToDisplay:React.Dispatch<React.SetStateAction<typeMessagesFromGetMessagesAndInfo[]>>,
  clickedUser:typeGottenUsers,
    setClickedUser:React.Dispatch<React.SetStateAction<typeGottenUsers>>,
}





// Post types

export type TypePostToRecievd = {
    id:string
    comments:CommentToRecieved [],
    date:{seconds:number,nanoseconds:number},
    likes:[],
    postImg:string,
    postText:string,
    userDisplayName:string,
    userImg:string
}
// export type TypeComment = {
//     name:string,
//     userImg:string,
//     date:string|number,
//     commentText:string
// }
export type CommentToRecieved = {
     userName:string,
        userId:string,
        commentId:string,
        userImg:string,
        commentText:string,
        date:{seconds:number,nanoseconds:number}
}


export type TypePost = {
    id:string | number,
    postText:string,
    postImg:File|null,
    date:string|number,
    user:string,
    userImg:string,
    likes:number,
    comments:CommentToRecieved [],
}

export type TypePostContext = {
    post:TypePost,
    setPost:Dispatch<SetStateAction<TypePost>>,
    handlePost:()=>void,
    postToDisplay:TypePostToRecievd[],
    setPostToDisplay:Dispatch<SetStateAction<TypePostToRecievd[]>>,
    handleViewSinglePost:(e: any,id:string | number)=>void,
     setSinglePost:Dispatch<SetStateAction<TypePostToRecievd>>,
     singlePost:TypePostToRecievd,
     handleLikes:(e:any,id:string|number)=>void,
     showCommentBox:boolean,
     setShowCommentBox:Dispatch<SetStateAction<boolean>>,
     comment:string,
     setComment:Dispatch<SetStateAction<string>>,
     handlePostYourcomment:(id:string | number)=>void,
      handleDeleteComment:(postId:number|string,comId:number|string)=>void,
}



// group chat context


export type messsgeGroupChat ={
    message:string,
    image?:File|null
}

export type TypeGroupChatMsg ={
messageId:string,
messageImg:string | null,
messageTxt:string,
userId:string,
userImg:string,
userName:string,
date:{seconds:number,nanoseconds:number}
}

export type TypeGroupChatContext = {
groupChatMsg:messsgeGroupChat,
setGroupChatMsg:Dispatch<SetStateAction<messsgeGroupChat>>,
groupChatMsgToDsiplay:TypeGroupChatMsg[],
setGroupChatMsgToDisplay:Dispatch<SetStateAction<TypeGroupChatMsg[]>>,
groupChartName:string,
setGroupChatName:Dispatch<SetStateAction<string>>,
sentGroupChatMsg:(item:string)=>void

}