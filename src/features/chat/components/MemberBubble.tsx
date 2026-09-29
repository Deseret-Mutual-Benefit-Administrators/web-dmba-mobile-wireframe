import { chatBubbleClasses } from "../services/chatBubbleClasses";

interface MemberBubbleProps {
  content: string;
}

/** The member's own message bubble — right-aligned, accent fill. */
export function MemberBubble({ content }: MemberBubbleProps) {
  const classes = chatBubbleClasses("member");

  return (
    <div className={classes.wrapper}>
      <div className={classes.bubble}>
        <span className={classes.text}>{content}</span>
      </div>
    </div>
  );
}
