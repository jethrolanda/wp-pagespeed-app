/**
 * WordPress dependencies
 */
import { store, getContext, getElement } from "@wordpress/interactivity";

store("pagespeed-app", {
  actions: {
    submit: () => {
      const context = getContext();
      alert(context.url);
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

      // context?.[ref.name] = ref.value;
      // console.log(ref, ref.name);
    }
  }
});
