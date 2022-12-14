import { AnyAction } from "redux"
import { MediaFilesMap } from "../../../../domains/media_files/entities";
import { mediaFilesFetched, mediaFilesFetchError } from "./actions";

type State = {
  mediaFiles: MediaFilesMap,
  errMsg?: string,
};

const initialState: State = {
  mediaFiles: {},
};

export default function mediaFilesReducer(state = initialState, action: AnyAction): State {
  if (mediaFilesFetched.match(action)) {
    return {
      ...state,
      mediaFiles: action.payload.mediaFiles,
    };
  }


  if (mediaFilesFetchError.match(action)) {
    return {
      ...state,
      errMsg: action.payload.errMsg,
    };
  }

  return state;
}
