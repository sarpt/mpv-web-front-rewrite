import styled from "@mui/material/styles/styled";

type Props = {
  onClick?: () => void;
  path: string | undefined;
} & React.HTMLAttributes<HTMLDivElement>;

export const PlaybackPath = ({ path, className, onClick }: Props) => {
  return (
    <PlaybackPathContainer className={className} title={path} onClick={onClick}>&#x200E;{path}</PlaybackPathContainer>
  );
};

export const PlaybackPathContainer = styled('div')`
  white-space: nowrap;
  direction: rtl;
  overflow-x: hidden;
  text-overflow: ellipsis;
  width: 100%;
`;
