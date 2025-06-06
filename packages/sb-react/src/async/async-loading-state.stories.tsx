import type { Meta } from "@storybook/react";
import React, { useState } from "react";
import {
  asyncDataLoaderFeature,
  hotkeysCoreFeature,
  selectionFeature,
} from "@headless-tree/core";
import { useTree } from "@headless-tree/react";
import cn from "classnames";

const meta = {
  title: "React/Async/Async Loading State",
  tags: ["feature/async-data-loader"],
} satisfies Meta;

export default meta;

// eslint-disable-next-line no-promise-executor-return
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// story-start
export const AsyncLoadingState = () => {
  const [loadingItemData, setLoadingItemData] = useState<string[]>([]);
  const [loadingItemChildrens, setLoadingItemChildrens] = useState<string[]>(
    [],
  );
  const tree = useTree<string>({
    state: { loadingItemData, loadingItemChildrens },
    setLoadingItemData,
    setLoadingItemChildrens,
    rootItemId: "root",
    getItemName: (item) => item.getItemData(),
    isItemFolder: () => true,
    createLoadingItemData: () => "Loading...",
    dataLoader: {
      getItem: (itemId) => wait(800).then(() => itemId),
      getChildren: (itemId) =>
        wait(800).then(() => [`${itemId}-1`, `${itemId}-2`, `${itemId}-3`]),
    },
    indent: 20,
    features: [asyncDataLoaderFeature, selectionFeature, hotkeysCoreFeature],
  });

  return (
    <>
      <div {...tree.getContainerProps()} className="tree">
        {tree.getItems().map((item) => (
          <button
            {...item.getProps()}
            key={item.getId()}
            style={{ paddingLeft: `${item.getItemMeta().level * 20}px` }}
          >
            <div
              className={cn("treeitem", {
                focused: item.isFocused(),
                expanded: item.isExpanded(),
                selected: item.isSelected(),
                folder: item.isFolder(),
              })}
            >
              {item.getItemName()}
              {item.isLoading() && " (loading...)"}
            </div>
            <button onClick={() => item.invalidateItemData()}>[i1]</button>
            <button onClick={() => item.invalidateChildrenIds()}>[i2]</button>
          </button>
        ))}
      </div>
      <p>
        Press [i1] to invalidate item data, or [i2] to invalidate its children
        array.
      </p>
      <p>Loading:</p>
      <pre>
        {JSON.stringify({ loadingItemData, loadingItemChildrens }, null, 2)}
      </pre>
    </>
  );
};
