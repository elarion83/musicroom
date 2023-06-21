
import ReactGA4 from "react-ga4";

ReactGA4.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_TRACKING_KEY);

export function CreateGoogleAnalyticsEvent(category,action,label) {
    ReactGA4.event({category: category,action: action,label: label});
}
