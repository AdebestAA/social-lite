"use client"
import { db, storage } from "@/firebase";
import {  TypePost, TypePostContext, TypePostToRecievd } from "@/types";
import { DocumentData, Timestamp, addDoc, arrayRemove, arrayUnion, collection, doc, getDocs, serverTimestamp, updateDoc } from "firebase/firestore";

import { ReactElement, createContext, useContext, useEffect, useLayoutEffect, useState } from "react";
import { AppContext } from "./AppProvider";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useRouter } from "next/navigation";


const initialContext:TypePostContext =  {
    post:{
     id:"" ,  
    postText:"",
    postImg:null,
    date:0,
    user:"",
    userImg:"",
    likes:0,
    comments:[],
},
    setPost:()=>{},
    handlePost:()=>{},
    postToDisplay:[],
    setPostToDisplay:()=>{},
    handleViewSinglePost:()=>{},
    setSinglePost:()=>{},
    singlePost:
    { 
    id:"",
    comments:[],
    date:{seconds:0,nanoseconds:0},
    likes:[],
    postImg:"",
    postText:"",
    userDisplayName:"",
    userImg:""
},
    handleLikes:()=>{},
    showCommentBox:false,
    setShowCommentBox:()=>{},
    comment:"",
    setComment:()=>{},
    handlePostYourcomment:()=>{},
     handleDeleteComment:()=>{}
    

}


const PostContext = createContext<TypePostContext>(initialContext)


const PostProvider = ({children}:{children:ReactElement})=> {
const [post,setPost] = useState<TypePost>({
    id:"",
    postText:"",
    postImg:null,
    date:0,
    user:"",
    userImg:"",
    likes:0,
    comments:[],
})
const [postToDisplay,setPostToDisplay] = useState<TypePostToRecievd[]>([])

const [singlePost,setSinglePost] = useState<TypePostToRecievd>({ id:"",
    comments:[],
    date:{seconds:0,nanoseconds:0},
    likes:[],
    postImg:"",
    postText:"",
    userDisplayName:"",
    userImg:""})
 const [showCommentBox,setShowCommentBox] = useState<boolean>(false)
 const [comment,setComment] = useState<string>("")
const {user} = useContext(AppContext)
// console.log(user);


const router = useRouter()

useEffect(()=>{
async function getAllPosts () {
    
    const querySnapshot = await getDocs(collection(db, "posts"));
    // console.log(querySnapshot);
let copyPostToDisplay:TypePostToRecievd[]  = []
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
//         // console.log(doc.id, " => ", doc.data());
//         console.log(doc.data());
      copyPostToDisplay =[...copyPostToDisplay,doc.data() as TypePostToRecievd]
         
     
         setPostToDisplay([...copyPostToDisplay])
        });
}


 getAllPosts()

},[showCommentBox,comment])

// console.log(singlePost);
// console.log("from context" );


// console.log(postToDisplay);

// handlelikes
// console.log(postToDisplay);

const  handleDeleteComment = async(postId:string|number,comId:string|number)=>{
   if (!user) {
        router.push("signup")
    }

const handleCommentRemove = doc(db, "posts", postId as string);

const getThePost = postToDisplay.find(item => item.id === postId)as 
TypePostToRecievd

const getComments = getThePost.comments;
let findComment = getComments.find(item => item.commentId === comId)
if (findComment?.userId === user.uid) {   
    await updateDoc(handleCommentRemove, {
        comments: arrayRemove({
            userName:user.displayName,
            userId:user.uid,
            commentId:findComment?.commentId,
            userImg:user.photoURL,
            commentText:findComment?.commentText,
            date:findComment?.date
        })
    });
    
}

}


// FOR POST COMMENT
const handlePostYourcomment = async(id:string|Number)=>{

    // if comment state is empty return
    if (!comment) {
        setShowCommentBox(false)
        return
    }

const handleComment = doc(db, "posts", id as string);
await updateDoc(handleComment, {
    comments: arrayUnion({
        userName:user.displayName,
        userId:user.uid,
        commentId:uuid(),
        userImg:user.photoURL,
        commentText:comment,
        date:Timestamp.now()
    })
});


setComment("")
setShowCommentBox(false)

}


const handleLikes = async(e:any,id:string|number)=>{
    e.stopPropagation()
const handleLike = doc(db, "posts", id as string);

const getThePost = postToDisplay.find(item => item.id === id) as TypePostToRecievd

const getLikesArrayOfPost:{userName:string,id:string,userImg:string}[] = getThePost?.likes;
let checkIfUserHasLikedItBefore = getLikesArrayOfPost?.some(item => item.id === user.uid) as boolean

if (checkIfUserHasLikedItBefore) {
await updateDoc(handleLike, {
    likes: arrayRemove({
        userName:user.displayName,
        id:user.uid,
        userImg:user.photoURL
    })
});
return
}



// Atomically add a new newLike to the "regions" array field.
await updateDoc(handleLike, {
    likes: arrayUnion({
        userName:user.displayName,
        id:user.uid,
        userImg:user.photoURL
    })
});

}


// handle view single Post
const handleViewSinglePost = (e: any,id:string | number)=>{

   if (!user) {
        router.push("signup")
    }
    const findPostFromPostTodisplay= postToDisplay.find(item => item.id === id) as TypePostToRecievd 
setSinglePost(findPostFromPostTodisplay)

router.push("/singlepost/"+id)


}

const handlePost = async()=> {

    if(!post.postText){
        console.log("input text is empty")
        return;
        
    }
console.log("posted");
console.log(post);

try {
    const docRef = await addDoc(collection(db, "posts"), {
    id:"",
    postText:post.postText,
    postImg:"",
    date:serverTimestamp(),
    userDisplayName:user.displayName,
    userImg:user.photoURL,
    likes:[],
    comments:[],
    userID:user.uid,
    userEmail:user.email
});


if (post.postImg) {
    
    const storageRef = ref(storage, post.postImg?.name);

const uploadTask = uploadBytesResumable(storageRef, post.postImg)


uploadTask.on('state_changed', 
  (snapshot) => {
    // Observe state change events such as progress, pause, and resume
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

  }, 
  (error) => {
    // Handle unsuccessful uploads
  }, 
  () => {
   
    getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
        
    const myPost = doc(db, "posts", docRef.id);
    await updateDoc(myPost, {
    id: docRef.id,
    postImg:downloadURL
    });
    });
  }
);
  router.push("/")
return

}

// update Id

    const myPost = doc(db, "posts", docRef.id);
    await updateDoc(myPost, {
    id: docRef.id,

    });
      router.push("/")

} catch (error:any) {
    
   alert(error.message)
    
}




}


    return (
        <PostContext.Provider value={{
        post,
        setPost,
        handlePost,
        setPostToDisplay,
        postToDisplay,
        handleViewSinglePost,
        setSinglePost,
        singlePost,
        handleLikes,
        showCommentBox,
        setShowCommentBox,
        comment,
        setComment,
        handlePostYourcomment,
         handleDeleteComment
        }}>
            {children}
        </PostContext.Provider>
            )

}

export {PostContext,PostProvider}