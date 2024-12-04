/**
 * WordPress dependencies
 */
import { store, getContext, getElement } from "@wordpress/interactivity";

function useCheckIfBanned(state, bannedStates) {
  const result = bannedStates
    .split(",")
    .filter((s) => s.trim().toLowerCase() === state.title.trim().toLowerCase());

  return result.length > 0 ? true : false;
}

function is5digits(input) {
  console.log(input);
  return input.match(/^[/\d]{5}?$/) !== null;
}

const { state, actions } = store("service-area", {
  state: {
    get hasResult() {
      const context = getContext();
      return (
        (context.zipfound || context.zipinvalid || context.zipbanned) ?? false
      );
    },
    urlZipcode: "",
    getUrlParamZipcode: () => {
      const urlParams = new URLSearchParams(window.location.search);
      console.log(urlParams.get("zipcode"));
      state.urlZipcode = urlParams.get("zipcode");
    }
  },
  actions: {
    *submit() {
      const context = getContext();

      const result = state.state_zipcodes.filter(
        (zip) =>
          parseInt(context.zipcode) >= parseInt(zip.min) &&
          parseInt(context.zipcode) <= parseInt(zip.max)
      );

      if (result.length > 0) {
        const isBanned = useCheckIfBanned(
          result[0],
          state.attributes.bannedStates
        );
        if (isBanned) {
          console.log("banned zipcode");
          context.zipfound = null;
          context.zipinvalid = null;
          context.zipbanned = true;
          context.state = result[0];
        } else {
          console.log("valid zipcode");
          context.zipfound = true;
          context.zipinvalid = null;
          context.zipbanned = null;
          context.state = result[0];
        }
      } else {
        console.log("invalid zipcode");
        context.zipfound = null;
        context.zipinvalid = true;
        context.zipbanned = null;
        context.state = null;
      }
      context.submitClicked = true;

      const { actions } = yield import("@wordpress/interactivity-router");
      yield actions.navigate(`${state.current_url}?zipcode=${context.zipcode}`);
      // console.log(`${state.currentv_url}?zip=${zipcode}`);
      // console.log(state.url);

      // var url = new URL(state.current_url);
      // url.searchParams.set("zipcode", context.zipcode);
      // console.log(url);

      state.getUrlParamZipcode();
    },
    *goBack() {
      const context = getContext();
      const { actions } = yield import("@wordpress/interactivity-router");
      yield actions.navigate(`${state.current_url}`);
      context.zipfound = null;
      context.zipinvalid = null;
      context.zipbanned = null;
      context.state = null;
      context.zipcode = null;
    }
  },
  callbacks: {
    setZipcode: () => {
      const context = getContext();
      const { ref } = getElement();
      context.zipcode = ref.value;
      console.log(ref);
    },
    toggleMessages: () => {
      const context = getContext();
      context.showMessages = true;
    },
    setGoogleMap: () => {
      const context = getContext();
      const { zipcode, state, submitClicked } = context;
      const { ref } = getElement();
      const iframe = ref.getElementsByTagName("iframe")[0];
      if (submitClicked && state && iframe) {
        const src = iframe.getAttribute("src");
        var href = new URL(src);
        href.searchParams.set("q", `${state.code} ${zipcode}`);
        iframe.setAttribute("src", href);
        console.log(zipcode, state);
      }
      context.submitClicked = false;
    },
    onLoad: () => {
      const context = getContext();

      if (context.zipcode > 0) actions.submit();
    }
  }
});
