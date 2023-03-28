import React, { useRef, useState, useEffect } from "react"
//import { useAuth } from "../../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import { Card } from "react-bootstrap"

import {
    Box,
    Text
} from "@chakra-ui/react";

//import NavigationBar from '../common/NavigationBar';

const { REACT_APP_API_ENDPOINT } = process.env;

const MyComments = ({loadGetComments, myComments}) => {

    //const { currentUser } = useAuth();
    const history = useHistory();
    const [email, setEmail] = React.useState('');
    const [userID, setUserID] = React.useState('');

    //const [myComments, setMyComments] = React.useState([]);

    useEffect(() => {
        loadGetComments();
    }, [loadGetComments()]);

   /* React.useEffect(() => {
        setEmail(currentUser.email);
        loaduserSearchByEmail(currentUser.email);
        //loadGetForums(); 
    }, []);

    const loaduserSearchByEmail = (email) => {
        callApiGetuserSearchByEmail(email)
            .then(res => {
                var parsed = JSON.parse(res.express);
                //console.log(parsed[0].id);
                setUserID(parsed[0].id);
            });
    }

    const callApiGetuserSearchByEmail = async (email) => {
        const url = `${REACT_APP_API_ENDPOINT}/userSearchByEmail`;
        //console.log(url);

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email
            })
        });
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    }
    */

    /* useEffect(() => {
        loadGetCommentsByUserID();
    }, [userID]);
    */

    /* const loadGetCommentsByUserID = async () => {
        try {
            const res = await CallApiGetCommentsByUserID(userID);
            const parsed = res.express;
            setMyComments(parsed);
        } catch (error) {
            console.error(error);
        }
    }
    */

    const CallApiGetCommentsByUserID = async (userID) => {

        const url = `${REACT_APP_API_ENDPOINT}/getForumCommentsByUserID?userID=${userID}`;
        console.log(url);

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    }

    return (
        <div >

           {/* <NavigationBar></NavigationBar>*/} 

            <Box sx={{ position: 'absolute', top: 115, left: '50%', transform: 'translate(-50%, -50%)' }}>
                <Text
                    className="title"
                >
                    My Comments
                </Text>
            </Box>

            <Box sx={{ position: 'absolute', top: 185, left: '50%', transform: 'translateX(-50%)' }}>
                {myComments.map((comment) => (
                    <Card style={{ width: '600px', marginBottom: '8px', padding: "16px" }} key={comment.id}>
                        {/* <Link to={`/forum/${comment.forumID}`} target="_blank"> */} 
                            <Text className="headerBig to-text">
                                {comment.forumTitle}
                            </Text>
                       {/* </Link>*/}  

                        <Text
                            className="header to-text"
                            marginTop="8px"
                        >
                            Commented on {new Date(new Date(comment.commentDateTime).getTime() - (4 * 60 * 60 * 1000)).toLocaleString()}
                        </Text>

                        <Text
                            className="header to-text"
                            marginTop="8px"
                        >
                            {comment.comment}
                        </Text>
                    </Card>
                ))}
            </Box>
        </div>
    )
}

export default MyComments; 