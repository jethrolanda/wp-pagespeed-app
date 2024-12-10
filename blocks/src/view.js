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
    },
    get progressPercentage() {
      const context = getContext();
      const progress = Math.round((context.page / context.totalPages) * 100);
      return `${progress < 5 ? "5" : progress}%`;
    },
    get getStatus() {
      const context = getContext();
      return `${context.page} out of ${context.totalPages}`;
    }
  },
  actions: {
    submit: async () => {
      const context = getContext();
      context.pagespeedResults = [];

      if (callbacks.isUrlValid()) {
        context.bgcolor = "#fff";
        context.processing = true;
        context.isDone = false;
        context.submitBtnText = "Processing...";

        try {
          while (!context.isDone) {
            console.log(context.isDone, context.page);
            const query = `?page=${context.page}`;
            const result = await getPages(context.url, query);
            context.totalPages = result?.totalPages;
            context.status = `Page ${context.page} out of ${context.totalPages}`;
            const params = `strategy=${
              context.device
            }&category=${context.category.join("&category=")}`;
            const scores = await pageSpeed(result?.urls, params);
            context.pagespeedResults = [...context.pagespeedResults, ...scores];
            // setData((prev) => [...prev, ...scores]);

            console.log(context.pagespeedResults);
            if (context.page < parseInt(context.totalPages)) {
              context.page += 1;
            } else {
              context.isDone = true;
              context.status = "";
            }
          }
        } catch (error) {
          console.log(error);
          alert("Error: Make sure the site is powered by wordpress");
        } finally {
          context.processing = false;
          context.submitBtnText = "Submit";
          context.bgcolor = "";
        }
      } else {
        alert("Invalid URL");
      }
    },
    downloadCSV: () => {
      const context = getContext();
      if (context.pagespeedResults.length <= 0)
        alert("Please generate a report first.");

      const titleKeys = Object.keys(context.pagespeedResults[0]);

      const refinedData = [];
      refinedData.push(titleKeys);

      context.pagespeedResults.forEach((item) => {
        refinedData.push(Object.values(item));
      });
      let csvContent = "";

      refinedData.forEach((row) => {
        csvContent += row.join(",") + "\n";
      });

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8," });
      const objUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.setAttribute("href", objUrl);
      link.setAttribute(
        "download",
        `Pagespeed report for ${callbacks.getDomainNameFromUrl()} - ${new Date().toLocaleString()}.csv`
      );
      link.click();
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
    getDomainNameFromUrl: () => {
      const context = getContext();
      const host = new URL(context.url).host;
      return host;
    },
    sortPerformance: () => {
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
          ? b?.best_practices - a?.best_practices
          : a?.best_practices - b?.best_practices;
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
