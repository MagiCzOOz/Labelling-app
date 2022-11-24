import React from 'react';

import type { LabelConfig, ErrorMessage } from '../../App';
import fetchLabels from '../../api/fetchLabels';

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
            fetchLabels('GET')
                .then((result: LabelConfig | ErrorMessage) => {
                    if (!('error' in result)) setLabelConfig(result);
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
