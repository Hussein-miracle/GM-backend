export interface UserSettings{
  share_screen:  boolean,
  play_voice: boolean,
  show_cam: boolean,
  show_caption:boolean
}

export interface MeetData{
  [key:string]:any;
}


// type sessionType = 'offer' | 'answer'
export interface SessionDataType{
  userId:string;
  meetingId:string;
  sessionDescription:{
    type:RTCSdpType;
    sdp:string;
  }
}