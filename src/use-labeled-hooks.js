import React from "react";

const REQUIRE_LABELS = true;

function useMissingLabelError(label) {
  if (REQUIRE_LABELS && !label) {
    throw new Error(
      `Missing or invalid debug label in a built-in React hook! Please add an object in the form { debugLabel: "hookName" } as the last parameter of the hook that you are trying to use (for useState(), useContext(), useReducer() and useRef()), respectively { debugLabel: "[dep1, dep2, ...]" } or { debugLabel: "*" } (for useEffect(), useCallback(), useMemo() and useLayoutEffect()) }.`
    );
  }
}

function parseCallbackArgs(args) {
  const callback = args[0];
  const callbackName = args[0].name;
  const hasNoDeps =
    args.length === 1 || !!(args.length === 2 && args[1].debugLabel);
  const deps = hasNoDeps ? undefined : args[1];
  const label = hasNoDeps ? args[1]?.debugLabel : args[2]?.debugLabel;
  return [callback, callbackName, deps, label];
}

function parseValueArgs(args) {
  const hasNoInitialValue =
    args.length === 0 || !!(args.length === 1 && args[0].debugLabel);
  const initialValue = hasNoInitialValue ? undefined : args[0];
  const label = initialValue ? args[1]?.debugLabel : args[0]?.debugLabel;
  return [initialValue, label];
}

function getCallbackDisplayName(callbackName, deps, debugLabel) {
  const result = `ƒ ${String(callbackName) || "anonymous"}(${debugLabel}) {} ${
    deps?.length ? JSON.stringify(deps) : ""
  }`;
  return result;
}

function getValueDisplayName(debugLabel) {
  const result = debugLabel || "Unlabeled";
  return result;
}

export function useState() {
  const [initialValue, debugLabel] = parseValueArgs(arguments);
  function useLabeledState() {
    useMissingLabelError(debugLabel);
    const [state, useState] = React.useState(initialValue);
    React.useDebugValue(state);
    return [state, useState];
  }
  useLabeledState.displayName = getValueDisplayName(debugLabel);
  return useLabeledState();
}

export function useEffect() {
  const [callback, callbackName, deps, debugLabel] = parseCallbackArgs(
    arguments
  );

  function useLabeledEffect() {
    useMissingLabelError(debugLabel);
    return React.useEffect(callback, deps);
  }

  useLabeledEffect.displayName = getCallbackDisplayName(
    callbackName,
    deps,
    debugLabel
  );
  return useLabeledEffect();
}

export function useContext(context, { debugLabel } = {}) {
  function useLabeledContext() {
    useMissingLabelError(debugLabel);
    return React.useContext(context);
  }
  useLabeledContext.displayName = debugLabel || "UnlabledContext";
  return useLabeledContext();
}

export function useReducer(reducer, initialValue, { debugLabel } = {}) {
  function useLabeledReducer() {
    useMissingLabelError(debugLabel);
    return React.useReducer(reducer, initialValue);
  }
  useLabeledReducer.displayName = debugLabel || "UnlabledReducer";
  return useLabeledReducer();
}

export function useCallback(cb, deps, { debugLabel } = {}) {
  function useLabeledCallback() {
    useMissingLabelError(debugLabel);
    return React.useCallback(cb, deps);
  }
  useLabeledCallback.displayName = `${debugLabel ||
    "UnlabledCallback"}: ${JSON.stringify(deps)}`;
  return useLabeledCallback();
}

export function useMemo(cb, deps, { debugLabel } = {}) {
  function useLabeledMemo() {
    useMissingLabelError(debugLabel);
    return React.useMemo(cb, deps);
  }
  useLabeledMemo.displayName = `${debugLabel ||
    "UnlabledMemo"}: ${JSON.stringify(deps)}`;
  return useLabeledMemo();
}

export function useRef(initialValue, { debugLabel } = {}) {
  function useLabeledRef() {
    useMissingLabelError(debugLabel);
    return React.useRef(initialValue);
  }
  useLabeledRef.displayName = debugLabel || "UnlabledRef";
  return useLabeledRef();
}

export function useLayoutEffect(cb, deps, { debugLabel } = {}) {
  function useLabeledLayoutEffect() {
    useMissingLabelError(debugLabel);
    return React.useLayoutEffect(cb, deps);
  }
  useLabeledLayoutEffect.displayName = `${debugLabel ||
    "UnlabledLayoutEffect"}: ${JSON.stringify(deps)}`;
  return useLabeledLayoutEffect();
}
