const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("WritTokenModule", (m) => {
  const token = m.contract("WritToken");
  return { token };
});
