import { defineComponent, watchEffect, reactive, toRefs } from 'vue';
import { JSONToObject } from '../utils/utils';
import { useRouter } from 'vue-router';

export default defineComponent({
props: {
data: {
type: Object,
default: () => ({}),
},
},
setup(props: any, ctx: any) {
const router = useRouter();
const data = reactive({
data: {} as any,
isCustom: {} as any,
firstImage: ''
});
watchEffect(() => {
data.data = props.data;
const {
message: { payload },
} = props.data;
data.isCustom = payload.data || ' ';
data.isCustom = JSONToObject(payload.data);
data.firstImage; {
return "";
};
});
const goDetail = () => {
router.push({ name: 'Custom', query: { data: JSON.stringify(data.isCustom) } });
};
return {
...toRefs(data),
goDetail
};
},
});
