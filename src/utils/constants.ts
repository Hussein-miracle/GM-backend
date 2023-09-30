export enum SOCKET_EVENTS{
  CREATE_MEET_LINK = 'create-meet-link',
  JOIN_MEET = 'join-meet',
  JOINED_MEET = 'joined-meet',
  CREATE_FUTURE_MEET_LINK = 'create-future-meet-link',
  LEAVE_MEET = 'leave-meet',
  UPDATE_JOINERS = 'update-joiners',
  MEET_LINK_CREATED = 'meet-link-created',

  OFFER = 'offer',
  OFFER_CREATED = 'offer-created',
  OFFER_CANDIDATE = 'offer-candidate',
  OFFER_CANDIDATE_CREATED = 'offer-candidate-created',


  CANDIDATE = 'candidate',
  CANDIDATE_CREATED = 'candidate-created',

  ANSWER = 'answer',
  ANSWER_CREATED = 'answer-created',
  ANSWER_CANDIDATE = 'answer-candidate',
  ANSWER_CANDIDATE_CREATED = 'answer-candidate-created',

  READY_FOR_PEERCONNECTION = 'ready-for-peerconnection',
  CLIENTS_READY_FOR_PEERCONNECTION = 'clients-ready-for-peerconnection',
}

export const CUSTOM_ALPHABETS = 'abcdefghijklmnopqrstuvwxyz';