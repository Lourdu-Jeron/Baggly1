export const Tag = ({bg,c,children,style={}}) => (
  <span className="tag" style={{background:bg,color:c,...style}}>{children}</span>
);

