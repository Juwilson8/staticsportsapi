// admin/config.tsx
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@keystone-ui/core';

function CustomLogo () {
    return <h3 css={{
        background: 'papayawhip'
    }}>Custom Logo here</h3>
}

export const components = {
    Logo: CustomLogo
}