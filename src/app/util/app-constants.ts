export class AppConstants {
  public static readonly ALL_ID: number = -100;
  public static readonly ALL_NAME: string = "ALL";

  public static SERVER_URL = '/api';
  public static USER_STORY_URL = AppConstants.SERVER_URL + '/userstory';
  public static PROJECT_URL = AppConstants.SERVER_URL + '/project';
  public static SPRINT_URL = AppConstants.SERVER_URL + '/sprint';
  public static TASK_URL = AppConstants.SERVER_URL + '/task';
  public static BUG_URL = AppConstants.SERVER_URL + '/bug';
  public static USER_URL = AppConstants.SERVER_URL + '/user';
  public static ORGANIZATION_URL = AppConstants.SERVER_URL + '/organization';

  public static readonly NEW = 'New';
  public static readonly IN_PROGRESS = 'In Progress';
  public static readonly IN_REVIEW = 'In Review';
  public static readonly DONE = 'Done';

  public static STATUS_LIST = [
    AppConstants.NEW,
    AppConstants.IN_PROGRESS,
    AppConstants.IN_REVIEW,
    AppConstants.DONE
  ];

}
