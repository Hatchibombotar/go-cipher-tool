export type OutputNodeData = {
  type: "output"
}

export function Output({ text }: { text: () => string; }) {
  return <div class="">
    <div class="">
      <p>{text()}</p>
    </div>
  </div>;
}
