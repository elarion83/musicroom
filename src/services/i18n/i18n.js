import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocale } from "../utils";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
        "GeneralContinue":'Continue',
        "GeneralLogin" : "Login",
        "GeneralLogout":'Logout',
        "GeneralSearchOn":'Search on',
        "GeneralOr":'Or',
        "GeneralAnd":'And',
        "GeneralYes":'Yes',
        "GeneralNo":'No',
        "GeneralBy":'By',
        "GeneralVia":'From',
        "GeneralClose":'Close',
        "GeneralLeave":'Leave',
        "GeneralStay":'Stay',
        "GeneralDelete":'Remove',
        "GeneralSave":'Save',
        "GeneralWait":'Wait',
        "GeneralSeconds":'Seconds',
        "GeneralEmpty":'empty',
        "GeneralEvery":'Every',
        "GeneralStatus":'Status',
        "GeneralPlaying":'Playing',
        "GeneralPause":'Paused',
        "GeneralAddedBy":'Added by',
        "GeneralNotLinked" : " not linked",
        "GeneralLinked" : " linked",
        "GeneralMediasInPlaylist":'Media(s) in playlist',
        "GeneralHome":'Homepage',
        "GeneralAnon" : "Anonymous",
        "GeneralLength":"Length",
        "GeneralSnackWelcome" : "Welcome",
        "GeneralSnackSeeYouSoon" : "See you soon !",
        "GeneralNickname" : "Nickname",
        
        "UserMenuMyProfile" : "My profile",
        "UserMenuMyRooms" : "My playlists",

        "HomePageButtonsCreateRoom" : "Create a playlist",
        "HomePageButtonsJoinRoom" : "Join a playlist",

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

        "ModalUserSettingsTitle" : "Account settings",
        "ModalUserSettingsEditNotAllowedTitle" : "Edition impossible",
        "ModalUserSettingsEditNotAllowedText" : "Profile editing is not possible in anonymous mode.",
        "ModalUserSettingsLabelLoginType" : "Login type",

        "ModalUserRoomListEmpty" : "You have no playlist",
        "ModalUserRoomListCreated" : "Created on",
        "ModalUserRoomListJoinRoomText" : "Join the playlist",

        
        "ModalJoinRoomIDOfTheRoom": "ID of the playlist you want to join",
        "ModalJoinRoomButtonJoin": "Join",
        
        "ModalLoginTitle": "Login / Register",
        "ModalLoginFormPlaceholderEmailAdress": "Mail adress",
        "ModalLoginFormPlaceholderPassword":"Password",
        "ModalLoginButtonAnon": "Continue as anonym",
        "ModalLoginButtonGoogle": "Continue with Google",
        "ModalLoginTermsSentence": "By using this service you agree to our",
        "ModalLoginTermsPrivacyPolicy": "privacy policy",
        "ModalLoginTermsYoutubeTerms": "Youtube terms of use.",
        
        "ModalLeaveRoomTitle": "Leave the playlist",
        "ModalLeaveRoomText": "You're about to leave the playlist to go back to reception. Are you sure?",
        
        "ModalShareRoomTitle": "Share the playlist",
        "ModalShareRoomCopyUrl": "Copy url",
        "ModalShareRoomUrlCopiedText": "URL Copied !",
        
        "ModalParamsRoomTitle": "Playlist settings",
        "ModalParamsRoomConnectToSpotifyText":"Connect to Spotify Premium",
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
        "RoomEmptyAlertWelcomeClickHere":"Click here to share it",
        "RoomEmptyAlertPlaylist":"The playlist is empty !",
        "RoomEmptyAlertPlaylistClickHere":"Click here to start",
        "RoomEmptyAlertSpotify":"Spotify Premium is not linked to the playlist !",
        "RoomEmptyAlertSpotifyClickHere":"Click here to link",
        "RoomEmptyAlertSpotifyBold":"Spotify Premium needed",
        "RoomEmptyAlertDeezer":"Deezer is not linked to the playlist !",
        "RoomEmptyAlertDeezerClickHere":"Click here to link",
    }
  },
  fr: {
    translation: {
        "GeneralContinue":'Continuer',
        "GeneralLogin":'Connexion',
        "GeneralLogout":'Déconnexion',
        "GeneralSearchOn":'Chercher sur',
        "GeneralOr":'Ou',
        "GeneralAnd":'Et',
        "GeneralYes":'Oui',
        "GeneralNo":'Non',
        "GeneralBy":'Par',
        "GeneralVia":'Via',
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
        "GeneralAddedBy":'Ajouté par',
        "GeneralNotLinked" : " non relié",
        "GeneralLinked" : " relié",
        "GeneralMediasInPlaylist":'Média(s) en playlist',
        "GeneralEmpty":'vide',
        "GeneralEvery":'Toutes les',
        "GeneralHome":'Accueil',
        "GeneralAnon" : "Anonyme",
        "GeneralLength":"Longueur",
        "GeneralSnackWelcome" : "Bienvenue",
        "GeneralSnackSeeYouSoon" : "A bientôt !",
        "GeneralNickname" : "Pseudo",
        
        
        "UserMenuMyProfile" : "Mon profil",
        "UserMenuMyRooms" : "Mes playlists",

        "HomePageButtonsCreateRoom" : "Créer une playlist",
        "HomePageButtonsJoinRoom" : "Rejoindre une playlist",

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

        "ModalUserSettingsTitle" : "Paramètres du compte",
        "ModalUserSettingsEditNotAllowedTitle" : "Edition impossible",
        "ModalUserSettingsEditNotAllowedText" : "L'édition du profil est impossible en anonyme.",
        "ModalUserSettingsLabelLoginType" : "Type de connexion",

        "ModalUserRoomListEmpty" : "Vous n'avez aucune playlist",
        "ModalUserRoomListCreated" : "Crée le",
        "ModalUserRoomListJoinRoomText" : "Rejoindre la playlist",

        "ModalJoinRoomIDOfTheRoom": "ID de la playlist a rejoindre",
        "ModalJoinRoomButtonJoin": "Rejoindre",
        
        "ModalLoginTitle": "Connexion / Inscription",
        "ModalLoginFormPlaceholderEmailAdress": "Adresse E-mail",
        "ModalLoginFormPlaceholderPassword":"Mot de passe",
        "ModalLoginButtonAnon": "Continuer en anonyme",
        "ModalLoginButtonGoogle": "Continuer avec Google",
        "ModalLoginTermsSentence": "En utilisant ce service vous acceptez nos",
        "ModalLoginTermsPrivacyPolicy": "Politique de confidentialité",
        "ModalLoginTermsYoutubeTerms": "les conditions d'utilisation de Youtube.",
        
        "ModalLeaveRoomTitle": "Quitter la playlist",
        "ModalLeaveRoomText": "Vous êtes sur le point de quitter la playlist pour retourner à l'accueil. Êtes-vous sûrs ?",
        
        "ModalShareRoomTitle": "Partager la playlist",
        "ModalShareRoomCopyUrl": "Copier l'url",
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
        "ModalParamsRoomAutoSyncText": "Synchronise automatiquement les utilisateurs a l\'hôte de la playlist.",

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
        "RoomEmptyAlertWelcomeClickHere":"Clique ici pour la partager",
        "RoomEmptyAlertPlaylist":"La playlist est vide !",
        "RoomEmptyAlertPlaylistClickHere":"Clique ici ou swipe up pour ajouter à la playlist !",
        "RoomEmptyAlertSpotify":"Spotify Premium n'est pas connecté !",
        "RoomEmptyAlertSpotifyClickHere":"Clique ici pour lier les deux",
        "RoomEmptyAlertSpotifyBold":"Spotify Premium requis",
        "RoomEmptyAlertDeezer":"Deezer n'est pas connecté !",
        "RoomEmptyAlertDeezerClickHere":"Clique ici pour lier les deux",
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