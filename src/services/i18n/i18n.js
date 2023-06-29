import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
        "GeneralContinue":'Continue',
        "GeneralOr":'Or',
        "GeneralAnd":'And',
        "GeneralHome":'Homepage',
        "GeneralSnackWelcome" : "Welcome",
        "GeneralSnackSeeYouSoon" : "See you soon !",
        "HomePageButtonsCreateRoom" : "Create a room",
        "HomePageButtonsJoinRoom" : "Join a room",
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
        "GeneralOr":'Ou',
        "GeneralAnd":'Et',
        "GeneralHome":'Accueil',
        "GeneralSnackWelcome" : "Bienvenue",
        "GeneralSnackSeeYouSoon" : "A bientôt !",
        "HomePageButtonsCreateRoom" : "Créer une room",
        "HomePageButtonsJoinRoom" : "Rejoindre une room",
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
    lng: lang,
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

  export default i18n;