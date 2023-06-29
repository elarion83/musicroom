import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
        "GeneralContinue":'Continue',
        "GeneralLogout":'Logout',
        "GeneralSearchOn":'Search on',
        "GeneralOr":'Or',
        "GeneralAnd":'And',
        "GeneralYes":'Yes',
        "GeneralNo":'No',
        "GeneralLeave":'Leave',
        "GeneralStay":'Stay',
        "GeneralWait":'Wait',
        "GeneralSeconds":'Seconds',
        "GeneralEmpty":'empty',
        "GeneralEvery":'Every',
        "GeneralStatus":'Status',
        "GeneralPlaying":'Playing',
        "GeneralPause":'Paused',
        "GeneralAddedBy":'Added by',
        "GeneralMediasInPlaylist":'Medias in playlist',
        "GeneralHome":'Homepage',
        "GeneralSnackWelcome" : "Welcome",
        "GeneralSnackSeeYouSoon" : "See you soon !",
        
        "UserMenuMyRooms" : "My rooms",

        "HomePageButtonsCreateRoom" : "Create a room",
        "HomePageButtonsJoinRoom" : "Join a room",

        "RoomAlertSpotifyNotVisibleTitle":"The Spotify player is only visible to the room's host.",
        "RoomAlertSpotifyNotVisibleText":"Add something to the playlist while you wait!",
        "RoomAlertSpotifyNotVisibleUnsyncTitle":"We're sorry.",
        "RoomAlertSpotifyNotVisibleUnsyncText":"The Spotify player is not currently available in desynchronized mode.",

        "RoomBottomButtonChatShow":"Show the chat",
        "RoomBottomButtonChatHide":"Hide chat",
        "RoomBottomDisplayFullScreen":"Fullscreen",
        "RoomBottomDisplayClassic":"Classic",

        "RoomChatWelcomeMessage": "Welcome on the chat !",
        "RoomChatPlaceholder" : "Send a message",

        "ModalUserSettingsTitle" : "Account settings",
        "ModalUserSettingsEditNotAllowedTitle" : "Edition impossible",
        "ModalUserSettingsEditNotAllowedText" : "Profile editing is not possible in anonymous mode.",

        "ModalJoinRoomIDOfTheRoom": "ID of the room you want to join",
        "ModalJoinRoomButtonJoin": "Join",
        
        "ModalLoginTitle": "Login / Register",
        "ModalLoginFormPlaceholderEmailAdress": "Mail adress",
        "ModalLoginFormPlaceholderPassword":"Password",
        "ModalLoginButtonAnon": "Continue as anonym",
        "ModalLoginButtonGoogle": "Continue with Google",
        "ModalLoginTermsSentence": "By using this service you agree to our",
        "ModalLoginTermsPrivacyPolicy": "privacy policy",
        "ModalLoginTermsYoutubeTerms": "Youtube terms of use.",
        
        "ModalLeaveRoomTitle": "Leave the romm ?",
        "ModalLeaveRoomText": "You're about to leave the room to go back to reception. Are you sure?",
        
        "ModalShareRoomTitle": "Share the room",
        "ModalShareRoomCopyUrl": "Copy url",
        "ModalShareRoomUrlCopiedText": "Copied in clipboard",
        
        "ModalParamsRoomTitle": "Room settings",
        "ModalParamsRoomConnectToSpotifyText":"Connect to Spotify",
        "ModalParamsRoomConnectedToSpotifyText":"The room is connected to Spotify",
        "ModalParamsRoomNotAllowedText":"Reserved for the room's host.",
        "ModalParamsRoomInteractionAllowedTitle": "Allow interaction",
        "ModalParamsRoomInteractionAllowedText": "Allows room members to interact with emoticons.",
        "ModalParamsRoomChatAllowedTitle": "Allow room chat",
        "ModalParamsRoomChatAllowedText": "Allow room chat.",
        "ModalParamsRoomLoopPlayingTitle": "Enable Loop playing",
        "ModalParamsRoomLoopPlayingText": "If the playlist is finished, the player returns to the first media.",
        "ModalParamsRoomAutoPlayingTitle": "Enable Autoplay",
        "ModalParamsRoomAutoPlayingText": "The player will automatically add media to the playlist.",
  
        "ModalRoomForceSpotifyDisconnectTitle":"Force disconnect from Spotify?",
        "ModalRoomForceSpotifyDisconnectText":"Spotify playback and search will no longer be available.",

        "RoomLeftMenuHost":"You are the host",
        "RoomLeftMenuHostedBy":"Hosted by",
        "RoomLeftMenuSpotifyNotLinked" : "Spotify not linked",
        "RoomLeftMenuSpotifyLinked" : "Spotify linked",
        "RoomLeftMenuNotSync" : "Unsynchronized",
        "RoomLeftMenuSync" : "Synchronized",
        "RoomLeftMenuRoomParams" : "Room settings",
        "RoomLeftMenuRoomShare" : "Share the room",
        "RoomLeftMenuRoomLeave" : "Leave the room",
        
        "RoomEmptyAlertWelcome":"Welcome in the room !",
        "RoomEmptyAlertWelcomeClickHere":"Click here to share it",
        "RoomEmptyAlertPlaylist":"The playlist is empty !",
        "RoomEmptyAlertPlaylistClickHere":"Click here to start",
        "RoomEmptyAlertSpotify":"Spotify is not linked to the room !",
        "RoomEmptyAlertSpotifyClickHere":"Click here to link",
        "RoomEmptyAlertSpotifyBold":"Spotify premium needed",
    }
  },
  fr: {
    translation: {
        "GeneralContinue":'Continuer',
        "GeneralLogout":'Déconnexion',
        "GeneralSearchOn":'Chercher sur',
        "GeneralOr":'Ou',
        "GeneralAnd":'Et',
        "GeneralYes":'Oui',
        "GeneralNo":'Non',
        "GeneralLeave":'Quitter',
        "GeneralStay":'Rester',
        "GeneralWait":'Attendre',
        "GeneralSeconds":'Secondes',
        "GeneralStatus":'Statut',
        "GeneralPlaying":'En lecture',
        "GeneralPause":'En Pause',
        "GeneralAddedBy":'Ajouté par',
        "GeneralMediasInPlaylist":'Médias en playlist',
        "GeneralEmpty":'vide',
        "GeneralEvery":'Toutes les',
        "GeneralHome":'Accueil',
        "GeneralSnackWelcome" : "Bienvenue",
        "GeneralSnackSeeYouSoon" : "A bientôt !",
        
        "UserMenuMyRooms" : "Mes rooms",

        "HomePageButtonsCreateRoom" : "Créer une room",
        "HomePageButtonsJoinRoom" : "Rejoindre une room",

        "RoomAlertSpotifyNotVisibleTitle":"Le lecteur Spotify n'est visible que par l'host de la room.",
        "RoomAlertSpotifyNotVisibleText":"Ajoute quelque chose dans la playlist en attendant !",
        "RoomAlertSpotifyNotVisibleUnsyncTitle":"Nous sommes désolé. ",
        "RoomAlertSpotifyNotVisibleUnsyncText":"Le lecteur Spotify n'est pour l'instant pas accessible en désynchronisé.",

        "RoomBottomButtonChatShow":"Voir le chat",
        "RoomBottomButtonChatHide":"Cacher le chat",
        "RoomBottomDisplayFullScreen":"Plein écran",
        "RoomBottomDisplayClassic":"Classique",

        "RoomChatWelcomeMessage": "Bienvenue sur le chat !",
        "RoomChatPlaceholder" : "Envoyer un message",

        "ModalUserSettingsTitle" : "Paramètres du compte",
        "ModalUserSettingsEditNotAllowedTitle" : "Edition impossible",
        "ModalUserSettingsEditNotAllowedText" : "L'édition du profil est impossible en anonyme.",

        "ModalJoinRoomIDOfTheRoom": "ID de la room a rejoindre",
        "ModalJoinRoomButtonJoin": "Rejoindre",
        
        "ModalLoginTitle": "Connexion / Inscription",
        "ModalLoginFormPlaceholderEmailAdress": "Adresse E-mail",
        "ModalLoginFormPlaceholderPassword":"Mot de passe",
        "ModalLoginButtonAnon": "Continuer en anonyme",
        "ModalLoginButtonGoogle": "Continuer avec Google",
        "ModalLoginTermsSentence": "En utilisant ce service vous acceptez nos",
        "ModalLoginTermsPrivacyPolicy": "Politique de confidentialité",
        "ModalLoginTermsYoutubeTerms": "les conditions d'utilisation de Youtube.",
        
        "ModalLeaveRoomTitle": "Quitter la room ?",
        "ModalLeaveRoomText": "Vous êtes sur le point de quitter la room pour retourner à l'accueil. Êtes-vous sûrs ?",
        
        "ModalShareRoomTitle": "Partager la room",
        "ModalShareRoomCopyUrl": "Copier l'url",
        "ModalShareRoomUrlCopiedText": "Copié dans le presse papier",

        "ModalParamsRoomTitle": "Paramètres de la room ",
        "ModalParamsRoomConnectToSpotifyText":"Connecter a Spotify",
        "ModalParamsRoomConnectedToSpotifyText":"La room est connectée a Spotify",
        "ModalParamsRoomNotAllowedText":"Reservé à l'hôte de la room.",
        "ModalParamsRoomInteractionAllowedTitle": "Autoriser les interactions",
        "ModalParamsRoomInteractionAllowedText": "Permet aux membres de la room d'intéragir avec les emoticones.",
        "ModalParamsRoomChatAllowedTitle": "Autoriser le chat de room",
        "ModalParamsRoomChatAllowedText": "Active le chat de la room.",
        "ModalParamsRoomLoopPlayingTitle": "Lecture en boucle",
        "ModalParamsRoomLoopPlayingText": "Si la playlist est finie, le lecteur reviens au premier média.",
        "ModalParamsRoomAutoPlayingTitle": "Lecture automatique",
        "ModalParamsRoomAutoPlayingText": "Le lecteur ajoutera automatiquement des médias à la playlist.",

        "ModalRoomForceSpotifyDisconnectTitle":"Forcer la deconnexion de Spotify ?",
        "ModalRoomForceSpotifyDisconnectText":"La lecture et la recherche via Spotify ne sera plus disponible.",

        "RoomLeftMenuHost":"Vous êtes l'hôte",
        "RoomLeftMenuHostedBy":"Hosté par",
        "RoomLeftMenuSpotifyNotLinked" : "Spotify non relié",
        "RoomLeftMenuSpotifyLinked" : "Spotify relié",
        "RoomLeftMenuNotSync" : "Lecture différée",
        "RoomLeftMenuSync" : "Lecture synchronisée",
        "RoomLeftMenuRoomParams" : "Paramètres de room",
        "RoomLeftMenuRoomShare" : "Partager la room",
        "RoomLeftMenuRoomLeave" : "Quitter la room",
        
        "RoomEmptyAlertWelcome":"Bienvenue dans la room !",
        "RoomEmptyAlertWelcomeClickHere":"Clique ici pour la partager",
        "RoomEmptyAlertPlaylist":"La playlist est vide !",
        "RoomEmptyAlertPlaylistClickHere":"Clique ici pour commencer",
        "RoomEmptyAlertSpotify":"Spotify n'est pas lié à la room !",
        "RoomEmptyAlertSpotifyClickHere":"Clique ici pour lier les deux",
        "RoomEmptyAlertSpotifyBold":"Spotify premium requis",
    }
  }
};

var lang = 'en';
if(navigator.language === 'fr' || navigator.language === 'fr-FR') {
    lang = 'fr';
}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

  export default i18n;