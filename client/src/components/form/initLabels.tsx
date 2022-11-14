import React from 'react';

import type { LabelConfig } from '../../App';
import fetchLabel from '../../api/fetchLabel';

const initialConfigState = {
    labels: {},
    issues: {},
    labelNames: [],
    issueNames: [],
    labelFormModel: {},
};

export default function initLabels(loginStatus: boolean) {
    const [labelConfig, setLabelConfig] = React.useState<LabelConfig>(initialConfigState);

    React.useEffect(() => {
        if (loginStatus) {
            fetchLabel('GET')
                .then((result: LabelConfig) => {
                    setLabelConfig(result);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [loginStatus]);

    return {
        labelConfig,
        setLabelConfig,
    };
}
