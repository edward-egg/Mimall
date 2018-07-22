<template>
    <div>
     <nav-header></nav-header>
      <div class="nav-breadcrumb-wrap">
        <div class="container">
          <nav class="nav-breadcrumb">
            <a href="/">Home</a>
            <span>Goods</span>
          </nav>
        </div>
      </div>
      <div class="accessory-result-page accessory-page">
        <div class="container">
          <div class="filter-nav">
            <span class="sortby">Sort by:</span>
            <a href="javascript:void(0)" class="default cur">Default</a>
            <a href="javascript:void(0)" class="price" @click="sortGoods">
                Price
                <svg class="icon icon-arrow-short" :class="{'sort-up':!sortFlag}">
                 <use xlink:href="#icon-arrow-short"></use>
                </svg>
            </a>
            <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
          </div>
          <div class="accessory-result">
            <!-- filter -->
            <div class="filter stopPop" id="filter" :class="{'filterby-show':filterBy}">
              <dl class="filter-price">
                <dt>Price:</dt>
                <dd><a href="javascript:void(0)" :class="{'cur':priceChecked=='all'}" @click="priceChecked='all'">All</a></dd>
                <dd v-for="(price,index) in priceFilter" :key="index" >
                  <a href="javascript:void(0)" :class="{'cur':priceChecked==index}" @click="setPriceFilter(index)">{{price.startPrice}} - {{price.endPrice}}</a>
                </dd>
                
              </dl>
            </div>

            <!-- search result accessories list -->
            <div class="accessory-list-wrap">
              <div class="accessory-list col-4">
                <ul>
                  <li v-for="(item,index) in goodList" :key="index">
                    <div class="pic">
                      <a href="#"><img v-lazy="'/static/'+item.productImg" alt=""></a>
                    </div>
                    <div class="main">
                      <div class="name">{{item.productName}}</div>
                      <div class="price">{{item.productPrice}}</div>
                      <div class="btn-area">
                        <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                      </div>
                    </div>
                  </li>                  
                </ul>
                <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="20">
                  <img src="./../assets/loading-spinning-bubbles.svg" v-show="loading"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
      <modal :mdShow="mdShow" v-on:close="closeModal()">
        <p slot="message" >
          请先登录，否则无法加入购物车！
        </p>
        <div slot="btnGroup">
          <a  class="btn btn--m" href="javascript:;" @click="mdShow = false">关闭</a>
        </div>
      </modal>
      <modal :mdShow="mdShowCart" v-on:close="closeModal()">
        <p slot="message" >
          加入购物车成功
        </p>
        <div slot="btnGroup">
          <a  class="btn btn--m" href="javascript:;" @click="mdShowCart = false">继续购物</a>
          <router-link class="btn btn--m" href="javascript:;" to="/cart">查看购物车</router-link>
        </div>
      </modal>
      <nav-footer></nav-footer>
    </div>
</template>
<script>
import NavHeader from "./../components/NavHeader";
import NavFooter from "./../components/NavFooter";
import Modal from './../components/Modal';
import axios from "axios";
export default {
  data() {
    return {
      sortFlag: true,
      page: 1,
      pageSize: 8,
      goodList: [],
      loading:false,
      mdShow:false,
      mdShowCart:false,
      priceFilter: [
        {
          startPrice: "0",
          endPrice: "500"
        },
        {
          startPrice: "500",
          endPrice: "1000"
        },
        {
          startPrice: "1000",
          endPrice: "5000"
        },
        {
          startPrice: "5000",
          endPrice: "10000"
        }
      ],
      priceChecked: "all",
      filterBy: false,
      overLayFlag: false,
      busy: true
    };
  },
  components: {
    NavHeader,
    NavFooter,
    Modal
  },
  mounted() {
    this.getGoodList();
    // this.addCart();
  },
  methods: {
    
    showFilterPop() {
      this.filterBy = true;
      this.overLayFlag = true;
    },
    closePop() {
      this.filterBy = false;
      this.overLayFlag = false;
    },
    setPriceFilter(index) {
      this.priceChecked = index;
      this.closePop();
      this.page = 1;
      this.getGoodList();
    },
    getGoodList(flag) {
      var param = {
        page: this.page,
        pageSize: this.pageSize,
        sort: this.sortFlag ? 1 : -1,
        priceLevel:this.priceChecked        

      };
      this.loading = true;
      axios
        .get("/goods/list", {
          params: param
        })
        .then(response => {
          let res = response.data;
          this.loading = false;
          if (res.status == "0") {
            if (flag) {
              this.goodList = this.goodList.concat(res.result.list);

              if(res.result.count==0){
                this.busy = true;
              }else{
                this.busy = false;
              }
            }else{
              this.goodList = res.result.list;
              this.busy = false;
            }
          } else {
            this.goodList = [];
          }
        });
    },
    sortGoods() {
      this.sortFlag = !this.sortFlag;
      this.page = 1;
      this.getGoodList();
    },
    loadMore() {
      this.busy = true;
      setTimeout(() => {
        this.page++;
        this.getGoodList(true);
      }, 1000);
    },
    addCart(productId){
      axios.post('/goods/addCart',{
        productId:productId
      }).then((response)=>{
        let res = response.data;
        if(res.status=='0'){
          this.mdShowCart = true;
          this.$store.commit('updateCartCount',1);
        }
        else{
          this.mdShow = true;
        }
      })
    },
    closeModal(){
      this.mdShow = false;
      this.mdShowCart = false;
    },

  }
};
</script>
