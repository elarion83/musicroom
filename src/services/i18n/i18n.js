import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocale } from "../utils";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
        "GeneralSlogan" : 'Real-time group playlists',
        "GeneralContinue":'Continue',
        "GeneralLogin" : "Login",
        "GeneralLogout":'Logout',
        "GeneralSearchOn":'Search on',
        "GeneralSearchFor":'Search for',
        "GeneralOr":'Or',
        "GeneralOn":'On',
        "GeneralAnd":'And',
        "GeneralYes":'Yes',
        "GeneralNo":'No',
        "GeneralBy":'By',
        "GeneralVia":'From',     
        "GeneralSuggestions":'Suggestions',  
        "GeneralForYou":'For You',  
        "GeneralErrorHappened":'An error has occurred',
        "GeneralBack":'Back',
        "GeneralClose":'Close',
        "GeneralLeave":'Leave',
        "GeneralStay":'Stay',
        "GeneralDelete":'Remove',
        "GeneralSave":'Save',
        "GeneralWait":'Wait',
        "GeneralSeconds":'Seconds',
        "GeneralEmpty":'empty',
        "GeneralMusics":'Musics',
        "GeneralVideos":'Videos',
        "GeneralMovieTrailers":"Movie trailers",
        "GeneralEvery":'Every',
        "GeneralTrendings" : "Trendings",
        "GeneralSmthTrendings" : "{{what}} trendings",
        "GeneralStatus":'Status',
        "GeneralPlaying":'Playing',
        "GeneralPause":'Paused',
        "GeneralLoading":'Loading..',
        "GeneralRefresh":'Refresh',
        "GeneralNoResult":"No result",
        "GeneralAdded":'Added',
        "GeneralAddedBy":'Added by',
        "GeneralNotLinked" : " not linked",
        "GeneralLinked" : " linked",
        "GeneralMediasInPlaylist":'Media(s) in playlist',
        "GeneralInPlaylist":'In playlist',
        "GeneralHome":'Homepage',
        "GeneralAnon" : "Anonymous",
        "GeneralLength":"Length",
        "GeneralSnackWelcome" : "Welcome {{who}} !",
        "GeneralSnackSeeYouSoon" : "See you soon !",
        "GeneralNickname" : "Nickname",
        "GeneralDownloadAPK" : "Get Android APP",
        "GeneralSendItToFriends" : "Send it to your friends",
        "GeneralSeeMore":'See more',
        "GeneralSeeLess":'See less',
        "GeneralSync":'Synchronized',
        "GeneralSyncRestart":'Retry synchro',

        "GeneralNearBy" : 'Nearby',
        
        "HomePageSlide1Title":"A real-time playlist for more than one person!",
        "HomePageSlide1Text1" : "Add media from Spotify and Youtube to a group playlist played back in real time.",
        "HomePageSlide1Text2":"With your mates, at a party, in the car, on a trip or at the gym, Play-it is the essential tool!",
        "HomePageSlide2Title" :"By all being in the same place...",
        "HomePageSlide2Text":"Ideal for parties, Play-it allows each guest to add their own music or video to the playlist, eliminating the need to use the party host's phone!",
        "HomePageSlide3Title" :"... or being at home on your own",
        "HomePageSlide3Text1":"Vibrate at the same pace as your mates in different parts of the planet!",
        "HomePageSlide3Text2":"Travelling, in the car, at home, studying or watching the latest YouTube videos under the duvet!",
        "HomePageSlide4Title" :"A playlist... and much more!",
        "HomePageSlide4Text1": "Thanks to chat, emoticons and votes, playlist members are an integral part of the atmosphere!",
        "HomePageSlide4Text2":"Find and replay the playlists you like thanks to desynchronised playback!",

        
        "UserMenuMyProfile" : "My profile",
        "UserMenuMyRooms" : "My playlists",
        "UserMemberSince" : "Member since",
        "UserMemberLastLogin" : "Last login on",

        "HomePageButtonsCreateRoom" : "Create a playlist",
        "HomePageButtonsJoinRoom" : "Join a playlist",

        "RoomTutorialSwipe" : "Swipe to open search !",
        "RoomTutorialClic" : "Clic to open search !",

        "RoomAlertSpotifyNotVisibleTitle":"The Spotify player is only visible to the playlist's host.",
        "RoomAlertSpotifyNotVisibleText":"Add something to the playlist while you wait!",
        "RoomAlertSpotifyNotVisibleUnsyncTitle":"We're sorry.",
        "RoomAlertSpotifyNotVisibleUnsyncText":"The Spotify player is not currently available in desynchronized mode.",

        "RoomBottomButtonChatShow":"Show the chat",
        "RoomBottomButtonChatHide":"Hide chat",
        "RoomBottomDisplayFullScreen":"Fullscreen",
        "RoomBottomDisplayInteractive":"Interactive",
        "RoomBottomDisplayClassic":"Classic",

        "RoomChatWelcomeMessage": "Welcome on the chat !",
        "RoomChatPlaceholder" : "Send a message",

        "ModalAddMediaSpotifyRecommTitle": "Only for you",
        "ModalAddMediaSearchResultTitle": "Results for {{searchTerm}}",

        "ModalUserSettingsTitle" : "Account settings",
        "ModalUserSettingsEditNotAllowedTitle" : "Edition impossible",
        "ModalUserSettingsEditNotAllowedText" : "Profile editing is not possible in anonymous mode.",
        "ModalUserSettingsLabelLoginType" : "Login type",

        "ModalUserRoomListEmpty" : "You have no playlist",
        "ModalUserRoomListCreated" : "Created on",
        "ModalUserRoomListJoinRoomText" : "Join the playlist",

        
        "ModalJoinRoomIDOfTheRoom": "Playlist ID",
        "ModalJoinRoomIDOfTheRoomText": "Enter below the ID of the playlist you wish to join (Ex: 5454S, E45FR)",
        "ModalJoinRoomButtonJoin": "Join",
        
        "ModalLoginTitle": "Authentication",
        "ModalLoginFormPlaceholderEmailAdress": "Mail adress",
        "ModalLoginFormPlaceholderPassword":"Password",
        "ModalLoginButtonAnon": "Continue as anonym",
        "ModalLoginButtonGoogle": "Continue with Google",
        "ModalLoginButtonSMS": "Continue by SMS",
        "ModalLoginButtonSMSSend": "Send SMS",
        "ModalLoginButtonSMSBy": "By SMS",
        "ModalLoginButtonSMSCode": "Verification code",
        "ModalLoginButtonSMSTuto1": "A code will be sent to this number, which you will be asked to enter in the next step",
        "ModalLoginTermsSentence": "By using this service you agree to our",
        "ModalLoginTermsPrivacyPolicy": "privacy policy",
        "ModalLoginTermsYoutubeTerms": "Youtube terms of use.",
        
        "ModalLeaveRoomTitle": "Leave the playlist",
        "ModalLeaveRoomText": "You're about to go back to reception. Are you sure?",
        
        "ModalShareRoomTitle": "Share the playlist",
        "ModalShareRoomCopyUrl": "Share url",
        "ModalShareRoomUrlCopiedText": "URL Copied !",
        
        "ModalParamsRoomTitle": "Playlist settings",
        "ModalParamsRoomConnectToSpotifyText":"Connect to Spotify",
        "ModalParamsRoomConnectedToSpotifyText":"The playlist is connected to Spotify",
        "ModalParamsRoomConnectToDeezerText":"Connect to Deezer",
        "ModalParamsRoomConnectedToDeezerText":"The playlist is connected to Deezer",
        "ModalParamsRoomNotAllowedText":"Reserved for the playlist's host.",
        "ModalParamsRoomInteractionAllowedTitle": "Allow interaction",
        "ModalParamsRoomInteractionAllowedText": "Allows playlist members to interact with emoticons.",
        "ModalParamsRoomChatAllowedTitle": "Allow playlist chat",
        "ModalParamsRoomChatAllowedText": "Allow playlist chat.",
        "ModalParamsRoomLoopPlayingTitle": "Enable Loop playing",
        "ModalParamsRoomLoopPlayingText": "If the playlist is finished, the player returns to the first media.",
        "ModalParamsRoomAutoPlayingTitle": "Enable Autoplay",
        "ModalParamsRoomAutoPlayingText": "The player will automatically add media to the playlist.",
        "ModalParamsRoomAutoSyncTitle": "Synchronized by default",
        "ModalParamsRoomAutoSyncText": "Automatically synchronizes users to the playlist host.",
  
        "ModalRoomForceSpotifyDisconnectTitle":"Force disconnect from Spotify?",
        "ModalRoomForceSpotifyDisconnectText":"Spotify playback and search will no longer be available.",

        "ModalRoomForceDeezerDisconnectTitle":"Force disconnect from Deezer?",
        "ModalRoomForceDeezerDisconnectText":"Deezer playback and search will no longer be available.",

        "ModalChangePlaylistAdmin" : 'Change host',
        "ModalChangePlaylistAdmin2" : 'Become host',

        "RoomLeftMenuHost":"You are the host",
        "RoomLeftMenuHostedBy":"Hosted by",
        "RoomLeftMenuNotSync" : "Unsynchronized",
        "RoomLeftMenuSync" : "Synchronized",
        "RoomLeftMenuRoomParams" : "Settings",
        "RoomLeftMenuRoomShare" : "Share the playlist",
        "RoomLeftMenuRoomLeave" : "Leave the playlist",
        
        "RoomEmptyAlertWelcome":"Welcome in the playlist !",
        "RoomEmptyAlertWelcomeClickHere":"Click here to share it to your friends ",
        "RoomEmptyAlertPlaylist":"The playlist is empty !",
        "RoomEmptyAlertPlaylistClickHere":"Click here to start looking for medias to play",
        "RoomEmptyAlertSpotify":"Spotify Premium is not linked to the playlist !",
        "RoomEmptyAlertSpotifyClickHere":"Click here to link",
        "RoomEmptyAlertSpotifyBold":"Spotify Premium needed",
        "RoomEmptyAlertDeezer":"Deezer is not linked to the playlist !",
        "RoomEmptyAlertDeezerClickHere":"Click here to link",  
        "RoomEmptyAlterGeolocTitleDisabled":"Geolocalize your playlist!",
        "RoomEmptyAlterGeolocTitleEnabled":"Your Playlist is geolocalized",
        "RoomEmptyAlterGeolocTextDisabled":"Click to make it accessible to people nearby!",
        "RoomEmptyAlterGeolocTextEnabled":"It is visible to people in the vicinity, click to cancel."
    }
  },
  fr: {
    translation: {
        "GeneralSlogan" : 'Playlists à plusieurs en temps réel',
        "GeneralContinue":'Continuer',
        "GeneralLogin":'Connexion',
        "GeneralLogout":'Déconnexion',
        "GeneralSearchOn":'Chercher sur',
        "GeneralSearchFor":'Chercher des ',
        "GeneralOr":'Où',
        "GeneralOn":'Sur',
        "GeneralAnd":'Et',
        "GeneralYes":'Oui',
        "GeneralNo":'Non',
        "GeneralBy":'Par',
        "GeneralVia":'Via',
        "GeneralSuggestions":'Suggestions',
        "GeneralForYou":'Pour vous',  
        "GeneralErrorHappened":'Une erreur est survenue',
        "GeneralBack":'Retour',
        "GeneralClose":'Fermer',
        "GeneralLeave":'Quitter',
        "GeneralStay":'Rester',
        "GeneralDelete":'Supprimer',
        "GeneralSave":'Enregistrer',
        "GeneralWait":'Attendre',
        "GeneralSeconds":'Secondes',
        "GeneralStatus":'Statut',
        "GeneralPlaying":'En lecture',
        "GeneralPause":'En Pause',
        "GeneralLoading":'Chargement..',
        "GeneralRefresh":'Rafraîchir',
        "GeneralNoResult":"Aucun résultat",
        "GeneralAdded":'Ajouté',
        "GeneralAddedBy":'Ajouté par',
        "GeneralNotLinked" : " non relié",
        "GeneralLinked" : " relié",
        "GeneralMediasInPlaylist":'Média(s) en playlist',
        "GeneralInPlaylist":'En playlist',
        "GeneralEmpty":'vide',
        "GeneralMusics":'Musiques',
        "GeneralVideos":'Vidéos',
        "GeneralMovieTrailers":"Bande annonces",
        "GeneralEvery":'Toutes les',
        "GeneralTrendings" : "En tendance",
        "GeneralSmthTrendings" : "{{what}} en tendance",
        "GeneralHome":'Accueil',
        "GeneralAnon" : "Anonyme",
        "GeneralLength":"Longueur",
        "GeneralSnackWelcome" : "Bienvenue {{who}} !",
        "GeneralSnackSeeYouSoon" : "A bientôt !",
        "GeneralNickname" : "Pseudo",
        "GeneralDownloadAPK" : "Télécharge l'APP",
        "GeneralSendItToFriends" : "Envoyez la à vos amis",
        "GeneralSeeMore":'Voir plus',
        "GeneralSeeLess":'Voir moins',
        "GeneralSync":'Synchronisé',
        "GeneralSyncRestart":'Relancer la synchro',
        
        "GeneralNearBy" : 'a proximité',

        "HomePageSlide1Title":"Youtube et Spotify au même endroit ET à plusieurs !",
        "HomePageSlide1Text1" : "Ajoute des médias depuis Spotify et Youtube à une playlist avec tes potes !",
        "HomePageSlide1Text2":"Créez, vibrez et réagissez ensemble au rythme de votre playlist. Entre potes, en soirée, en voiture, au travail, Play-it est indispensable !",
        "HomePageSlide2Title" :"En étant tous au même endroit ..",
        "HomePageSlide2Text":"Idéal pour les soirées, avec Play-It, chaque convive peut mettre la musique depuis son téléphone, plus besoin d'embêter de l'hôte de la soirée !",
        "HomePageSlide3Title" :".. ou chacun de son côté !",
        "HomePageSlide3Text1":"Vibrez ensemble et en même temps à des endroits différents !",  
        "HomePageSlide3Text2":"En voyage, en séminaires d'entreprise, chacun chez soi en révisant ou en réunion à travers le globe !",
        "HomePageSlide4Title" :"Une playlist.. et bien plus !",
        "HomePageSlide4Text1": "Grâce au chat, aux émoticones et aux votes, les membres de la playlist font partie intégrante de l'ambiance !",
        "HomePageSlide4Text2":"Lecture désynchronisé, mot de passe, paramètres personnalisés,.. sur play-it, c'est vous le maître !",


        "UserMenuMyProfile" : "Mon profil",
        "UserMenuMyRooms" : "Mes playlists",
        "UserMemberSince" : "Membre depuis le",
        "UserMemberLastLogin" : "Dernière connexion le",

        "HomePageButtonsCreateRoom" : "Créer une playlist",
        "HomePageButtonsJoinRoom" : "Rejoindre une playlist",

        "RoomTutorialSwipe" : "Swipe pour rechercher !",
        "RoomTutorialClic" : "Clique pour rechercher !",

        "RoomAlertSpotifyNotVisibleTitle":"Le lecteur Spotify n'est visible que par l'host de la playlist.",
        "RoomAlertSpotifyNotVisibleText":"Ajoute quelque chose dans la playlist en attendant !",
        "RoomAlertSpotifyNotVisibleUnsyncTitle":"Nous sommes désolé. ",
        "RoomAlertSpotifyNotVisibleUnsyncText":"Le lecteur Spotify n'est pour l'instant pas accessible en désynchronisé.",

        "RoomBottomButtonChatShow":"Voir le chat",
        "RoomBottomButtonChatHide":"Cacher le chat",
        "RoomBottomDisplayFullScreen":"Plein écran",
        "RoomBottomDisplayInteractive":"Interactif",
        "RoomBottomDisplayClassic":"Classique",

        "RoomChatWelcomeMessage": "Bienvenue sur le chat !",
        "RoomChatPlaceholder" : "Envoyer un message",

        "ModalAddMediaSpotifyRecommTitle": "Selon vos goûts",
        "ModalAddMediaSearchResultTitle": "Résultats pour {{searchTerm}}",

        "ModalUserSettingsTitle" : "Paramètres du compte",
        "ModalUserSettingsEditNotAllowedTitle" : "Edition impossible",
        "ModalUserSettingsEditNotAllowedText" : "L'édition du profil est impossible en anonyme.",
        "ModalUserSettingsLabelLoginType" : "Type de connexion",

        "ModalUserRoomListEmpty" : "Vous n'avez aucune playlist",
        "ModalUserRoomListCreated" : "Crée le",
        "ModalUserRoomListJoinRoomText" : "Rejoindre la playlist",

        "ModalJoinRoomIDOfTheRoom": "ID de playlist",
        "ModalJoinRoomIDOfTheRoomText": "Entrez ci-dessous l'ID de la playlist que vous souhaitez rejoindre. (Ex : 5454S, E45FR).",
        "ModalJoinRoomButtonJoin": "Rejoindre",
        
        "ModalLoginTitle": "Authentification",
        "ModalLoginFormPlaceholderEmailAdress": "Adresse E-mail",
        "ModalLoginFormPlaceholderPassword":"Mot de passe",
        "ModalLoginButtonAnon": "Continuer en anonyme",
        "ModalLoginButtonGoogle": "Continuer avec Google",
        "ModalLoginButtonSMS": "Continuer par SMS",
        "ModalLoginButtonSMSSend": "Envoyer SMS",
        "ModalLoginButtonSMSBy": "Par SMS",
        "ModalLoginButtonSMSCode": "Code de vérification",
        "ModalLoginButtonSMSTuto1" : "Un code vous sera envoyé à ce numéro, il vous sera demandé à l'étape suivante.",
        "ModalLoginTermsSentence": "En utilisant ce service vous acceptez nos",
        "ModalLoginTermsPrivacyPolicy": "Politique de confidentialité",
        "ModalLoginTermsYoutubeTerms": "les conditions d'utilisation de Youtube.",
        
        "ModalLeaveRoomTitle": "Quitter la playlist",
        "ModalLeaveRoomText": "Vous êtes sur le point de retourner à l'accueil. Êtes-vous sûrs ?",
        
        "ModalShareRoomTitle": "Partager la playlist",
        "ModalShareRoomCopyUrl": "Url de partage",
        "ModalShareRoomUrlCopiedText": "URL copiée !",

        "ModalParamsRoomTitle": "Paramètres de la playlist ",
        "ModalParamsRoomConnectToSpotifyText":"Connecter a Spotify Premium",
        "ModalParamsRoomConnectedToSpotifyText":"La playlist est connectée a Spotify",
        "ModalParamsRoomConnectToDeezerText":"Connecter a Deezer",
        "ModalParamsRoomConnectedToDeezerText":"La playlist est connectée a Deezer",
        "ModalParamsRoomNotAllowedText":"Reservé à l'hôte de la playlist.",
        "ModalParamsRoomInteractionAllowedTitle": "Autoriser les interactions",
        "ModalParamsRoomInteractionAllowedText": "Permet aux membres de la playlist d'intéragir avec les emoticones.",
        "ModalParamsRoomChatAllowedTitle": "Autoriser le chat de playlist",
        "ModalParamsRoomChatAllowedText": "Active le chat de la playlist.",
        "ModalParamsRoomLoopPlayingTitle": "Lecture en boucle",
        "ModalParamsRoomLoopPlayingText": "Si la playlist est finie, le lecteur reviens au premier média.",
        "ModalParamsRoomAutoPlayingTitle": "Lecture automatique",
        "ModalParamsRoomAutoPlayingText": "Le lecteur ajoutera automatiquement des médias à la playlist.",
        "ModalParamsRoomAutoSyncTitle": "Synchronisés par défaut",
        "ModalParamsRoomAutoSyncText": "Synchronise automatiquement les utilisateurs a l'hôte de la playlist.",

        "ModalRoomForceSpotifyDisconnectTitle":"Forcer la deconnexion de Spotify ?",
        "ModalRoomForceSpotifyDisconnectText":"La lecture et la recherche via Spotify ne sera plus disponible.",

        "ModalRoomForceDeezerDisconnectTitle":"Forcer la deconnexion de Deezer ?",
        "ModalRoomForceDeezerDisconnectText":"La lecture et la recherche via Deezer ne sera plus disponible.",

        "ModalChangePlaylistAdmin" : 'Changement d\'hôte',
        "ModalChangePlaylistAdmin2" : 'Devenir hôte',

        "RoomLeftMenuHost":"Vous êtes l'hôte",
        "RoomLeftMenuHostedBy":"Hosté par",
        "RoomLeftMenuSpotifyLinked" : "Spotify relié",
        "RoomLeftMenuNotSync" : "Différé",
        "RoomLeftMenuSync" : "Synchronisé",
        "RoomLeftMenuRoomParams" : "Paramètres",
        "RoomLeftMenuRoomShare" : "Partager la playlist",
        "RoomLeftMenuRoomLeave" : "Quitter la playlist",
        
        "RoomEmptyAlertWelcome":"Bienvenue dans la playlist !",
        "RoomEmptyAlertWelcomeClickHere":"Clique ici pour la partager à tes potes",
        "RoomEmptyAlertPlaylist":"La playlist est vide !",
        "RoomEmptyAlertPlaylistClickHere":"Clique ici ou swipe up pour chercher des médias !",
        "RoomEmptyAlertSpotify":"Spotify Premium n'est pas connecté !",
        "RoomEmptyAlertSpotifyClickHere":"Clique ici pour lier les deux",
        "RoomEmptyAlertSpotifyBold":"Spotify Premium requis",
        "RoomEmptyAlertDeezer":"Deezer n'est pas connecté !",
        "RoomEmptyAlertDeezerClickHere":"Clique ici pour lier les deux",
        "RoomEmptyAlterGeolocTitleDisabled":"Geolocalise ta playlist !",
        "RoomEmptyAlterGeolocTitleEnabled":"Ta Playlist est géolocalisée",
        "RoomEmptyAlterGeolocTextDisabled":"Clique pour la rendre accessible aux gens à proximité !",
        "RoomEmptyAlterGeolocTextEnabled":"Elle est visible par les gens aux alentours, clique pour annuler."
    }
  }
};


i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: getLocale(),
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

  export default i18n;