/**
 * WordPress dependencies
 */
import { store, getContext, getElement } from "@wordpress/interactivity";
import { getPages, pageSpeed } from "./actions";
const { state, callbacks } = store("pagespeed-app", {
  state: {
    performanceSorted: false,
    accessibilitySorted: false,
    bestPracticesSorted: false,
    seoSorted: false,
    get isNotEmpty() {
      return getContext().pagespeedResults.length > 0;
    },
    get isPerformanceSelected() {
      return getContext().category.includes("performance");
    },
    get isAccessibility() {
      return getContext().category.includes("accessibility");
    },
    get isBestPracticesSelected() {
      return getContext().category.includes("best-practices");
    },
    get isSeoSelected() {
      return getContext().category.includes("seo");
    }
  },
  actions: {
    submit: async () => {
      const context = getContext();
      context.pagespeedResults = [];

      if (callbacks.isUrlValid()) {
        context.processing = true;
        context.submitBtnText = "Processing...";
        //   const formData = new FormData();
        //   formData.append("action", "wpa_generate_pagespeed_report");
        //   formData.append("nonce", state.nonce);
        //   formData.append("url", context.url);
        //   formData.append("device", context.device);
        //   formData.append("post_types", context.post_types);
        //   formData.append("category", context.category);

        //   yield fetch(state.ajax_url, {
        //     method: "POST",
        //     body: formData
        //   })
        //     .then((response) => response.json())
        //     .then((data) => {
        //       console.log(data);
        //       if (data.status === "success") {
        //       }
        //     })
        //     .finally(() => {
        //       context.processing = false;
        //       context.submitBtnText = "Submit";
        //     });
        // } else {
        //   alert("Invalid url");
        let page = 1;
        let isDone = false;

        try {
          while (!isDone) {
            console.log(isDone, page);
            const query = `?page=${page}`;
            const result = await getPages(context.url, query);
            const totalPages = result?.totalPages;
            context.submitBtnText = `Processing... Page ${page} out of ${totalPages}`;
            const params = `strategy=${
              context.device
            }&category=${context.category.join("&category=")}`;
            const scores = await pageSpeed(result?.urls, params);
            context.pagespeedResults = [...context.pagespeedResults, ...scores];
            // setData((prev) => [...prev, ...scores]);

            console.log(context.pagespeedResults);
            if (page < parseInt(totalPages)) {
              page += 1;
            } else {
              isDone = true;
            }
          }
        } catch (error) {
          console.log(error);
        } finally {
          context.processing = false;
          context.submitBtnText = "Submit";
        }
      }
    }
  },
  callbacks: {
    setUrl: () => {
      const context = getContext();
      const { ref } = getElement();
      context.url = ref.value;
    },
    setOptions: () => {
      const context = getContext();
      const { post_types, category } = context;
      const { ref } = getElement();

      switch (ref.name) {
        case "device":
          context.device = ref.value;
          break;
        case "post_types":
          if (!post_types.includes(ref.value)) {
            context.post_types.push(ref.value);
          } else {
            context.post_types.splice(post_types.indexOf(ref.value), 1);
          }
          break;
        case "category":
          if (!category.includes(ref.value)) {
            context.category.push(ref.value);
          } else {
            context.category.splice(category.indexOf(ref.value), 1);
          }
          break;
        default:
          break;
      }
    },
    isUrlValid: () => {
      try {
        const context = getContext();
        const pattern = new RegExp(
          "^([a-zA-Z]+:\\/\\/)?" + // protocol
            "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
            "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR IP (v4) address
            "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
            "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
            "(\\#[-a-z\\d_]*)?$", // fragment locator
          "i"
        );

        // console.log(new URL(context.url));
        // return new URL(context.url) ? true : false;
        return pattern.test(context.url);
      } catch (error) {
        return false;
      }
    },
    sortPerformance: () => {
      console.log(state.performanceSorted);
      const context = getContext();
      context.pagespeedResults = context.pagespeedResults.sort((a, b) => {
        return state.performanceSorted
          ? b?.performance - a?.performance
          : a?.performance - b?.performance;
      });
      state.performanceSorted = !state.performanceSorted;
    },
    sortAccessibility: () => {
      const context = getContext();
      context.pagespeedResults = context.pagespeedResults.sort((a, b) => {
        return state.accessibilitySorted
          ? b?.accessibility - a?.accessibility
          : a?.accessibility - b?.accessibility;
      });
      state.accessibilitySorted = !state.accessibilitySorted;
    },
    sortBestPractices: () => {
      const context = getContext();
      context.pagespeedResults = context.pagespeedResults.sort((a, b) => {
        return state.bestPracticesSorted
          ? b?.["best-practices"] - a?.["best-practices"]
          : a?.["best-practices"] - b?.["best-practices"];
      });
      state.bestPracticesSorted = !state.bestPracticesSorted;
    },
    sortSeo: () => {
      const context = getContext();
      context.pagespeedResults = context.pagespeedResults.sort((a, b) => {
        return state.seoSorted ? b?.seo - a?.seo : a?.seo - b?.seo;
      });
      state.seoSorted = !state.seoSorted;
    }
  }
});
