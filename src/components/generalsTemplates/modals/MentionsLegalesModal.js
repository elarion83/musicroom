import { Dialog, DialogContent, DialogContentText, DialogTitle, Grid } from '@mui/material';
import React from "react";

import { Icon } from '@iconify/react';
import { SlideUp } from '../../../services/materialSlideTransition/Slide';

const MentionsLegalesModal = ({open, changeOpen}) => {
    
    return(
            <Dialog open={open} TransitionComponent={SlideUp} onClose={() => changeOpen(false)}
                sx={{
                    "& .MuiDialog-container": {
                        "& .MuiPaper-root": {
                        width: "100%",
                        maxWidth: "500px",  // Set your width here
                        },
                    },
                }}
                >
                <DialogTitle className='flexRowCenterH' sx={{ m: 0,p:1}}>
                        <Icon icon='carbon:user-avatar' style={{marginRight:'10px'}} /> Mentions légales
                </DialogTitle>  
                <DialogContent dividers sx={{pt:0}}>
                    <DialogContentText sx={{pt:2}}>
                    
                        <Grid container direction="column" >
                            <h3>1 - Édition du site</h3>

                            En vertu de l'article 6 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique, il est précisé aux utilisateurs du site internet https://www.play-it.fr l'identité des différents intervenants dans le cadre de sa réalisation et de son suivi:

                            Propriétaire du site :

                            Identification de l'entreprise : 

                            Directeur de la publication : - Contact : 

                            Hébergeur : 1&1 / IONOS - 7 Place de la Gare - 57200 Sarreguemines - Téléphone : 09.70.80.89.11

                            Délégué à la protection des données : -

                            Autres contributeurs :
                            <h3>2 - Propriété intellectuelle et contrefaçons.</h3>

                            Play-it est propriétaire des droits de propriété intellectuelle et détient les droits d’usage sur tous les éléments accessibles sur le site internet, notamment les textes, images, graphismes, logos, vidéos, architecture, icônes et sons.

                            Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable de Gruwe Nicolas.

                            Toute exploitation non autorisée du site ou de l’un quelconque des éléments qu’il contient sera considérée comme constitutive d’une contrefaçon et poursuivie conformément aux dispositions des articles L.335-2 et suivants du Code de Propriété Intellectuelle.
                            <h3>3 - Limitations de responsabilité.</h3>

                            Play-it ne pourra être tenu pour responsable des dommages directs et indirects causés au matériel de l’utilisateur, lors de l’accès au site https://www.play-it.fr.

                            Play-it décline toute responsabilité quant à l’utilisation qui pourrait être faite des informations et contenus présents sur https://www.play-it.fr.

                            Play-it s’engage à sécuriser au mieux le site https://www.play-it.fr, cependant sa responsabilité ne pourra être mise en cause si des données indésirables sont importées et installées sur son site à son insu.

                            Des espaces interactifs (espace contact ou commentaires) sont à la disposition des utilisateurs. Play-it se réserve le droit de supprimer, sans mise en demeure préalable, tout contenu déposé dans cet espace qui contreviendrait à la législation applicable en France, en particulier aux dispositions relatives à la protection des données.

                            Le cas échéant, Play-it se réserve également la possibilité de mettre en cause la responsabilité civile et/ou pénale de l’utilisateur, notamment en cas de message à caractère raciste, injurieux, diffamant, ou pornographique, quel que soit le support utilisé (texte, photographie …).
                            <h3>4 - CNIL et gestion des données personnelles.</h3>

                            Conformément aux dispositions de la loi 78-17 du 6 janvier 1978 modifiée, l’utilisateur du site https://www.play-it.fr dispose d’un droit d’accès, de modification et de suppression des informations collectées. Pour exercer ce droit, envoyez un message à notre Délégué à la Protection des Données : - .

                            Pour plus d'informations sur la façon dont nous traitons vos données (type de données, finalité, destinataire...), lisez notre https://www.play-it.fr. [Consignes : ajoutez ici le lien hypertexte vers votre politique de confidentialité]
                            <h3>5 - Liens hypertextes et cookies</h3>

                            Le site https://www.play-it.fr contient des liens hypertextes vers d’autres sites et dégage toute responsabilité à propos de ces liens externes ou des liens créés par d’autres sites vers https://www.play-it.fr.

                            La navigation sur le site https://www.play-it.fr est susceptible de provoquer l’installation de cookie(s) sur l’ordinateur de l’utilisateur.

                            Un "cookie" est un fichier de petite taille qui enregistre des informations relatives à la navigation d’un utilisateur sur un site. Les données ainsi obtenues permettent d'obtenir des mesures de fréquentation, par exemple.

                            Vous avez la possibilité d’accepter ou de refuser les cookies en modifiant les paramètres de votre navigateur. Aucun cookie ne sera déposé sans votre consentement.

                            Les cookies sont enregistrés pour une durée maximale de mois.

                            Pour plus d'informations sur la façon dont nous faisons usage des cookies, lisez notre https://www.play-it.fr. 
                            <h3>6 - Droit applicable et attribution de juridiction.</h3>

                            Tout litige en relation avec l’utilisation du site https://www.play-it.fr est soumis au droit français. 
                            En dehors des cas où la loi ne le permet pas, il est fait attribution exclusive de juridiction aux tribunaux compétents de Toulouse.
                        </Grid>
                    </DialogContentText>
                </DialogContent>
            </Dialog>
  
    )
};

export default MentionsLegalesModal;