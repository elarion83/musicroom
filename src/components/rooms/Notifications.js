import { withTranslation } from "react-i18next";
import { useEffect, useState } from 'react';
import { doc, getDoc, onSnapshot, setDoc, } from 'firebase/firestore';
import { Store } from 'react-notifications-component';
import { isEmpty } from '../../services/utils';
import { Typography } from "@mui/material";
const Notifications = ({roomRef, initialCount}) => { // USED TO SHOW THE NOTIFICATIONS, NOT SAVING THEM
    
    const [notifications, setNotifications] = useState([]);
    
    const listenToNotifications = (callback) => {
        return onSnapshot(roomRef, async (docSnapshot) => {
            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                const notifsArray = data.notifsArray || [];
                setNotifications(notifsArray);
            } 
        });
    };

    useEffect(() => {
        const unsubscribe = listenToNotifications(setNotifications);

        return () => unsubscribe();
    }, []);

    
    useEffect(() => {
        if(!isEmpty(notifications) && notifications.length !== initialCount) {
            var notifToShow= notifications[notifications.length-1];
            Store.addNotification({
                title: notifToShow.title,
                message: <Typography>{notifToShow.message}</Typography>,
                type: notifToShow.type,
                insert: "bottom",
                container: "top-right",
                animationIn: ["animate__animated", "animate__fadeInRight"],
                animationOut: ["animate__animated", "animate__fadeOutRight"],
                dismiss: {
                    duration: notifToShow.duration,
                    onScreen: true,
                    pauseOnHover: true,
                    showIcon: true,
                    click: true,
                    touch: true
                },
                touchSlidingExit: {
                    swipe: {
                        duration: 400,
                        timingFunction: 'ease-out',
                        delay: 0,
                    },
                    fade: {
                        duration: 400,
                        timingFunction: 'ease-out',
                        delay: 0
                    }
                }
            });
        }
    }, [notifications.length]);


    return(
        <></>
    )
};

export default withTranslation()(Notifications);