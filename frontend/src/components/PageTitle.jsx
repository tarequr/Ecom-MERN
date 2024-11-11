import React from 'react'
import { Helmet } from "react-helmet";

function PageTitle(props) {
    return (
        <Helmet>
            <title>{props.title}</title>
        </Helmet>
    )
}

export default PageTitle