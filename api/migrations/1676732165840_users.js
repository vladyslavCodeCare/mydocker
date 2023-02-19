/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("users", {
    id: "id",
    email: { type: "varchar(50)", notNull: true, unique: true },
    name: { type: "varchar(20)", notNull: true },
    phones: { type: "varchar(15)[]", notNull: true },
    createdAt: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("users", { cascade: true });
};
