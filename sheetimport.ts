import {getContext} from '@keystone-6/core/context';
import config from './keystone';

import * as PrismaModule from '@prisma/client';

export default async function main() {
    const context = getContext(config, PrismaModule);

    console.log('(script.ts)', 'connect');
    await config.db.onConnect?.(context);

    const user = await context.db.User.findOne({
        where: {email: 'julianrwilson38@gmail.com'},
    });

    console.log("FOUND USER", user)

    const game = await context.db.Game.createOne({
        data: {
            title: 'Test Game',
            author: { connect: { id: user.id } },
        },
    });

    console.log("Created Game", game)
}
main();
