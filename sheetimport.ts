import { getContext } from '@keystone-6/core/context';
import config from './keystone';

// WARNING: this is only needed for our monorepo examples, dont do this
import * as PrismaModule from '.prisma/client';

//   do this instead
// import * as PrismaModule from '@prisma/client';

export default async function main() {
  const context = getContext(config, PrismaModule);

  console.log('(script.ts)', 'connect');
  await config.db.onConnect?.(context);

  const user = await context.db.User.findOne({
    where: { name: 'Julian Wilson' },
  });

  const game = await context.db.Game.createOne({
    data: {
      title: 'Test Game',
      content: 'This is test about game',
      author: user,
    },
  });
}
main();
