import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocale } from "../utils";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
        "GeneralSlogan" : 'Real-time collective playlists',
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

        
        "HomePageSlide1Title":"A real-time playlist for more than one person!",
        "HomePageSlide1Text1" : "Add media from Spotify and Youtube to a collective playlist played back in real time.",
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

        "ModalAddMediaSearchResultTitle": "Results for {{searchTerm}}",

        "ModalUserSettingsTitle" : "Account settings",
        "ModalUserSettingsEditNotAllowedTitle" : "Edition impossible",
        "ModalUserSettingsEditNotAllowedText" : "Profile editing is not possible in anonymous mode.",
        "ModalUserSettingsLabelLoginType" : "Login type",

        "ModalUserRoomListEmpty" : "You have no playlist",
        "ModalUserRoomListCreated" : "Created on",
        "ModalUserRoomListJoinRoomText" : "Join the playlist",

        
        "ModalJoinRoomIDOfTheRoom": "ID of the playlist you want to join",
        "ModalJoinRoomIDOfTheRoomText": "Enter below the ID of the playlist you wish to join (Ex: 5454S, E45FR)",
        "ModalJoinRoomButtonJoin": "Join",
        
        "ModalLoginTitle": "Authentication",
        "ModalLoginFormPlaceholderEmailAdress": "Mail adress",
        "ModalLoginFormPlaceholderPassword":"Password",
        "ModalLoginButtonAnon": "Continue as anonym",
        "ModalLoginButtonGoogle": "Continue with Google",
        "ModalLoginButtonSMS": "Continue by SMS",
        "ModalLoginTermsSentence": "By using this service you agree to our",
        "ModalLoginTermsPrivacyPolicy": "privacy policy",
        "ModalLoginTermsYoutubeTerms": "Youtube terms of use.",
        
        "ModalLeaveRoomTitle": "Leave the playlist",
        "ModalLeaveRoomText": "You're about to go back to reception. Are you sure?",
        
        "ModalShareRoomTitle": "Share the playlist",
        "ModalShareRoomCopyUrl": "Share url",
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
        "GeneralSlogan" : 'Playlists collective en temps réel',
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
        "GeneralSmthTrendings" : "{{what}} en tendances",
        "GeneralHome":'Accueil',
        "GeneralAnon" : "Anonyme",
        "GeneralLength":"Longueur",
        "GeneralSnackWelcome" : "Bienvenue {{who}} !",
        "GeneralSnackSeeYouSoon" : "A bientôt !",
        "GeneralNickname" : "Pseudo",
        "GeneralDownloadAPK" : "Télécharger l'APP",
        "GeneralSendItToFriends" : "Envoyez la à vos amis",
        
        
        "HomePageSlide1Title":"Une playlist en temps réel entre potes !",
        "HomePageSlide1Text1" : "Ajoutez des médias depuis Spotify et Youtube à une playlist collective lue en temps réel.",
        "HomePageSlide1Text2":"Votez, tchatez, réagissez et vibrez ensemble au rythme de votre playlist. Entre potes, en soirée, en voiture, en voyage, ou au sport, Play-it est l'outil indispensable !",
        "HomePageSlide2Title" :"En étant tous au même endroit ..",
        "HomePageSlide2Text":"Idéal pour les soirées, Play-it permet a chaque convive d'ajouter sa musique ou sa vidéo à la suite de la playlist, plus besoin d'utiliser le téléphone de l'hôte de la soirée !",
        "HomePageSlide3Title" :".. ou en étant chacun chez soi",
        "HomePageSlide3Text1":"Vibre au même rythme que tes potes à des endroits différents de la planète !",
        "HomePageSlide3Text2":"En voyage, chacun dans sa voiture, chacun chez soi en révisant ou en mattant les dernières vidéos youtube sous la couette !",
        "HomePageSlide4Title" :"Une playlist.. et bien plus !",
        "HomePageSlide4Text1": "Grâce au chat, aux émoticones et aux votes, les membres de la playlist font partie intégrante de l'ambiance !",
        "HomePageSlide4Text2":"Retrouvez et relisez les playlist qui vous on plu grâce à la lecture désynchronisée !",


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

        "ModalAddMediaSearchResultTitle": "Résultats pour {{searchTerm}}",

        "ModalUserSettingsTitle" : "Paramètres du compte",
        "ModalUserSettingsEditNotAllowedTitle" : "Edition impossible",
        "ModalUserSettingsEditNotAllowedText" : "L'édition du profil est impossible en anonyme.",
        "ModalUserSettingsLabelLoginType" : "Type de connexion",

        "ModalUserRoomListEmpty" : "Vous n'avez aucune playlist",
        "ModalUserRoomListCreated" : "Crée le",
        "ModalUserRoomListJoinRoomText" : "Rejoindre la playlist",

        "ModalJoinRoomIDOfTheRoom": "ID de la playlist a rejoindre",
        "ModalJoinRoomIDOfTheRoomText": "Entrez ci-dessous l'ID de la playlist que vous souhaitez rejoindre. (Ex : 5454S, E45FR).",
        "ModalJoinRoomButtonJoin": "Rejoindre",
        
        "ModalLoginTitle": "Authentification",
        "ModalLoginFormPlaceholderEmailAdress": "Adresse E-mail",
        "ModalLoginFormPlaceholderPassword":"Mot de passe",
        "ModalLoginButtonAnon": "Continuer en anonyme",
        "ModalLoginButtonGoogle": "Continuer avec Google",
        "ModalLoginButtonSMS": "Continuer par SMS",
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