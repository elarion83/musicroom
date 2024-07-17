

import React, { useEffect, useState } from "react";

import { withTranslation } from "react-i18next";
import { auth } from "../../services/firebase";
import { Helmet } from "react-helmet-async";
const MetaTags = ({metaData}) => {
    return(
      <Helmet>
            <meta property="og:title" content={metaData.title} />
            <meta property="og:description" content={metaData.description} />
            <meta property="og:image" content={metaData.image} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={window.location.href} />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={metaData.title} />
            <meta name="twitter:description" content={metaData.description} />
            <meta name="twitter:image" content={metaData.image} />
      </Helmet>
    )
};

export default withTranslation()(MetaTags);