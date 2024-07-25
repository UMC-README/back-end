export class UserProfileDto {
  constructor(nickname, profileImage, penaltyCount) {
    this.nickname = nickname;
    this.profileImage = profileImage;
    this.penaltyCount = penaltyCount;
  }
}
