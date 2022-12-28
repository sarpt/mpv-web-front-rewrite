import { useVirtualizer } from "@tanstack/react-virtual";
import { ReactElement, useRef } from "react";

export type EntryRendererProps<T> = { entry: T, idx: number };

export type Props<T> = {
  data: T[],
  width: number,
  height: number,
  rowSize: number,
  onSelected: (entry: T) => void,
  entryRenderer: (props: EntryRendererProps<T>) => ReactElement
};

export function VirtualList<T>({ data, height, rowSize, entryRenderer, onSelected }: Props<T>) {
  const parentRef = useRef<HTMLDivElement | null>(null);

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowSize,
  });

  return (
    <>
      <div
        ref={parentRef}
        style={{
          height: `${height}px`,
          overflow: 'auto',
        }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: `100%`,
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualItem) => {
            const itemIdx = virtualItem.index;

            return (
              <div
                key={virtualItem.key}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
                onClick={() => onSelected(data[itemIdx])}
              >
                {
                  entryRenderer({ entry: data[itemIdx], idx: itemIdx })
                }
              </div>
            );
          })}
        </div>
      </div>
    </>
  )
};
