# StaticSports Content Management System

## If password is lost run

To set your password to "12345678", run `UPDATE User set password = "$2a$10$cWWv1qbXnFEZJx4FJKOy0OMJDgNX2XL7kNBxRSaWqFbiX6ooNKfE" where email = 'name@domain.com';'`


### Run importer:

# `npx ts-node sheetimports.ts`
# or to ignore errors: `npx ts-node -T sheetimports.ts`
