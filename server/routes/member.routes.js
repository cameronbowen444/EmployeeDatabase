const MemberController = require("../controllers/member.controller");
const { authenticate } = require("../middleware/auth.middleware");

module.exports = (app) => {
  app.get("/api", MemberController.index);

  app.get("/api/members", authenticate, MemberController.getAllMembers);
  app.post("/api/members", authenticate, MemberController.createMember);
  app.get("/api/members/:id", authenticate, MemberController.getOneMember);
  app.put(
    "/api/members/edit/:id",
    authenticate,
    MemberController.updateMember
  );
  app.delete("/api/members/:id", authenticate, MemberController.deleteMember);
};