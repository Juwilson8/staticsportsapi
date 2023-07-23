"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// keystone.ts
var keystone_exports = {};
__export(keystone_exports, {
  default: () => keystone_default
});
module.exports = __toCommonJS(keystone_exports);
var import_core2 = require("@keystone-6/core");

// schema.ts
var import_core = require("@keystone-6/core");
var import_access = require("@keystone-6/core/access");
var import_fields = require("@keystone-6/core/fields");
var import_fields_document = require("@keystone-6/fields-document");
var lists = {
  User: (0, import_core.list)({
    // WARNING
    //   for this starter project, anyone can create, query, update and delete anything
    //   if you want to prevent random people on the internet from accessing your data,
    //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
    access: import_access.allowAll,
    // this is the fields for our User list
    fields: {
      // by adding isRequired, we enforce that every User should have a name
      //   if no name is provided, an error will be displayed
      name: (0, import_fields.text)(
        { validation: { isRequired: true } }
      ),
      email: (0, import_fields.text)({
        validation: { isRequired: true },
        // by adding isIndexed: 'unique', we're saying that no user can have the same
        // email as another user - this may or may not be a good idea for your project
        isIndexed: "unique"
      }),
      password: (0, import_fields.password)({ validation: { isRequired: true } }),
      createdAt: (0, import_fields.timestamp)({
        // this sets the timestamp to Date.now() when the user is first created
        defaultValue: { kind: "now" }
      })
    },
    graphql: {
      plural: "Users",
      fields: {
        id: { type: "ID" },
        name: { type: "String" },
        email: { type: "String" }
      }
    }
  }),
  Game: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      title: (0, import_fields.text)({ validation: { isRequired: true } }),
      content: (0, import_fields_document.document)({
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1]
        ],
        links: true,
        dividers: true
      }),
      author: (0, import_fields.relationship)({
        ref: "User",
        many: false
      })
    }
  }),
  MetricType: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      name: (0, import_fields.text)()
      // icon: image({ storage: 'metrictypes_storage' }), // TODO: configuration storage
    }
  }),
  Metric: (0, import_core.list)({
    access: import_access.allowAll,
    ui: {
      description: "",
      isHidden: ({ session: session2, context }) => false,
      hideCreate: ({ session: session2, context }) => false,
      // TODO: display conditionally on user permissions?
      hideDelete: ({ session: session2, context }) => false,
      // TODO: display conditionally on user permissions?
      createView: {
        defaultFieldMode: ({ session: session2, context }) => "edit"
      },
      itemView: {
        defaultFieldMode: ({ session: session2, context, item }) => "edit"
      },
      listView: {
        initialColumns: ["game", "drive", "play", "metric_type", "metric_value"],
        defaultFieldMode: ({ session: session2, context }) => "read",
        searchFields: ["game.name", "metric_value", "metric_type"],
        labelField: "metric_value",
        initialSort: { field: "metric_type", direction: "ASC" }
      }
    },
    fields: {
      metric_value: (0, import_fields.text)({ validation: { isRequired: true } }),
      metric_type: (0, import_fields.relationship)({
        ref: "MetricType",
        many: false
      }),
      game: (0, import_fields.relationship)({
        ref: "Game",
        many: false
      }),
      drive: (0, import_fields.integer)({ validation: { isRequired: true } }),
      play: (0, import_fields.integer)({ validation: { isRequired: true } }),
      second_mark: (0, import_fields.integer)({ validation: { isRequired: false } })
    }
  })
};

// auth.ts
var import_crypto = require("crypto");
var import_auth = require("@keystone-6/auth");
var import_session = require("@keystone-6/core/session");
var sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret && process.env.NODE_ENV !== "production") {
  sessionSecret = (0, import_crypto.randomBytes)(32).toString("hex");
}
var { withAuth } = (0, import_auth.createAuth)({
  listKey: "User",
  identityField: "email",
  // this is a GraphQL query fragment for fetching what data will be attached to a context.session
  //   this can be helpful for when you are writing your access control functions
  //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
  sessionData: "name createdAt",
  secretField: "password",
  // WARNING: remove initFirstItem functionality in production
  //   see https://keystonejs.com/docs/config/auth#init-first-item for more
  initFirstItem: {
    // if there are no items in the database, by configuring this field
    //   you are asking the Keystone AdminUI to create a new user
    //   providing inputs for these fields
    fields: ["name", "email", "password"]
    // it uses context.sudo() to do this, which bypasses any access control you might have
    //   you shouldn't use this in production
  }
});
var sessionMaxAge = 60 * 60 * 24 * 30;
var session = (0, import_session.statelessSessions)({
  maxAge: sessionMaxAge,
  secret: sessionSecret
});

// keystone.ts
var keystone_default = withAuth(
  (0, import_core2.config)({
    db: {
      // we're using sqlite for the fastest startup experience
      //   for more information on what database might be appropriate for you
      //   see https://keystonejs.com/docs/guides/choosing-a-database#title
      provider: "sqlite",
      url: "file:./mydatabase.db"
    },
    lists,
    session
  })
);
