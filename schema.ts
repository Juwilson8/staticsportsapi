// Welcome to your schema
//   Schema driven development is Keystone's modus operandi
//
// This file is where we define the lists, fields and hooks for our data.
// If you want to learn more about how lists are configured, please read
// - https://keystonejs.com/docs/config/lists

import {list} from '@keystone-6/core';
import {allowAll} from '@keystone-6/core/access';

// see https://keystonejs.com/docs/fields/overview for the full list of fields
//   this is a few common fields for an example
import {
    text,
    relationship,
    password,
    timestamp,
    select,
    image,
    integer,
} from '@keystone-6/core/fields';

// the document field is a more complicated field, so it has it's own package
import {document} from '@keystone-6/fields-document';
// if you want to make your own fields, see https://keystonejs.com/docs/guides/custom-fields

// when using Typescript, you can refine your types to a stricter subset by importing
// the generated types from '.keystone/types'
import type {Lists} from '.keystone/types';

export const lists: Lists = {
    User: list({
        // WARNING
        //   for this starter project, anyone can create, query, update and delete anything
        //   if you want to prevent random people on the internet from accessing your data,
        //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
        access: allowAll,

        // this is the fields for our User list
        fields: {
            // by adding isRequired, we enforce that every User should have a name
            //   if no name is provided, an error will be displayed
            name: text(
                {validation: {isRequired: true}}
            ),

            email: text({
                validation: {isRequired: true},
                // by adding isIndexed: 'unique', we're saying that no user can have the same
                // email as another user - this may or may not be a good idea for your project
                isIndexed: 'unique',
            }),

            password: password({validation: {isRequired: true}}),

            createdAt: timestamp({
                // this sets the timestamp to Date.now() when the user is first created
                defaultValue: {kind: 'now'},
            })
        },
        graphql: {
            plural: 'Users',
            fields: {
                id: {type: 'ID'},
                name: {type: 'String'},
                email: {type: 'String'}
            }
        }
    }),


    Game: list({
        access: allowAll,
        fields: {
            title: text({validation: {isRequired: true}}),
            content: document({
                formatting: true,
                layouts: [
                    [1, 1],
                    [1, 1, 1],
                    [2, 1],
                    [1, 2],
                    [1, 2, 1],
                ],
                links: true,
                dividers: true,
            }),

            author: relationship({
                ref: 'User',
                many: false,
            }),
        },
    }),

    MetricType: list({

        access: allowAll,
        fields: {
            name: text(),
            // icon: image({ storage: 'metrictypes_storage' }), // TODO: configuration storage
        },
    }),

    Metric: list({
        access: allowAll,
        ui: {
            description: '',
            isHidden: ({session, context}) => false,
            hideCreate: ({session, context}) => false, // TODO: display conditionally on user permissions?
            hideDelete: ({session, context}) => false, // TODO: display conditionally on user permissions?
            createView: {
                defaultFieldMode: ({session, context}) => 'edit'
            },
            itemView: {
                defaultFieldMode: ({session, context, item}) => 'edit'
            },
            listView: {
                initialColumns: ['game', 'drive', 'play', 'metric_type', 'metric_value'],
                defaultFieldMode: ({session, context}) => 'read',
                searchFields: ['game.name', 'metric_value', 'metric_type'],
                labelField: 'metric_value',
                initialSort: {field: 'metric_type', direction: 'ASC'},
            }
        },
        fields: {
            metric_value: text({validation: {isRequired: true}}),
            metric_type: relationship({
                ref: 'MetricType',
                many: false
            }),
            game: relationship({
                ref: 'Game',
                many: false
            }),
            drive: integer({validation: {isRequired: true}}),
            play: integer({validation: {isRequired: true}}),
            second_mark: integer({validation: {isRequired: false}}),
        },
    }),

};
